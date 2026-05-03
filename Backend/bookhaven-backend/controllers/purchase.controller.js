const crypto = require("crypto");
const db = require("../config/db");

const razorpayConfig = {
  keyId: process.env.RAZORPAY_KEY_ID || "",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  merchantName: process.env.MERCHANT_NAME || "BookHaven Store",
  currency: process.env.RAZORPAY_CURRENCY || "INR",
};

const ensurePurchaseGatewayColumns = async () => {
  const [columns] = await db.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'purchases'`,
  );

  const names = new Set(columns.map((column) => column.COLUMN_NAME));
  const statements = [];

  if (!names.has("payment_provider")) {
    statements.push("ALTER TABLE purchases ADD COLUMN payment_provider VARCHAR(40) DEFAULT 'manual'");
  }
  if (!names.has("gateway_order_id")) {
    statements.push("ALTER TABLE purchases ADD COLUMN gateway_order_id VARCHAR(120) DEFAULT ''");
  }
  if (!names.has("gateway_payment_id")) {
    statements.push("ALTER TABLE purchases ADD COLUMN gateway_payment_id VARCHAR(120) DEFAULT ''");
  }

  for (const statement of statements) {
    await db.execute(statement);
  }
};

const buildRazorpayAuthHeader = () =>
  `Basic ${Buffer.from(`${razorpayConfig.keyId}:${razorpayConfig.keySecret}`).toString("base64")}`;

const ensureGatewayConfigured = () => {
  if (!razorpayConfig.keyId || !razorpayConfig.keySecret) {
    const error = new Error("Razorpay is not configured.");
    error.statusCode = 500;
    throw error;
  }
};

const getBookAndOwnership = async (userId, bookId) => {
  const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [bookId]);
  if (books.length === 0) {
    return { book: null, ownsBook: false };
  }

  const [purchaseRows] = await db.execute(
    "SELECT id, payment_status, gateway_payment_id, gateway_order_id FROM purchases WHERE user_id = ? AND book_id = ?",
    [userId, bookId],
  );

  return {
    book: books[0],
    ownsBook: purchaseRows.length > 0,
    purchase: purchaseRows[0] || null,
  };
};

const createRazorpayOrderRequest = async (book, user) => {
  ensureGatewayConfigured();

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: buildRazorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(Number(book.price || 0) * 100),
      currency: razorpayConfig.currency,
      receipt: `book-${book.id}-user-${user.id}-${Date.now()}`,
      notes: {
        book_id: String(book.id),
        user_id: String(user.id),
        book_title: book.title,
        user_email: user.email,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error?.description || data.message || "Failed to create payment order.");
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const getCheckoutInfo = async (req, res) => {
  try {
    await ensurePurchaseGatewayColumns();

    const { bookId } = req.params;
    const { book, ownsBook } = await getBookAndOwnership(req.user.id, bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    if (book.category !== "paid") {
      return res.status(400).json({ success: false, message: "This book is free to read." });
    }

    return res.status(200).json({
      success: true,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price,
        image: book.image,
      },
      owned: ownsBook,
      gateway: {
        provider: "razorpay",
        keyId: razorpayConfig.keyId,
        merchantName: razorpayConfig.merchantName,
        currency: razorpayConfig.currency,
        supportedMethods: ["upi", "netbanking", "cards", "wallets"],
      },
    });
  } catch (err) {
    console.error("Checkout Info Error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to load checkout details.",
    });
  }
};

const createGatewayOrder = async (req, res) => {
  try {
    await ensurePurchaseGatewayColumns();

    const { bookId } = req.params;
    const { book, ownsBook } = await getBookAndOwnership(req.user.id, bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    if (book.category !== "paid") {
      return res.status(400).json({ success: false, message: "This book is free to read." });
    }

    if (ownsBook) {
      return res.status(409).json({ success: false, message: "You already own this book." });
    }

    const order = await createRazorpayOrderRequest(book, req.user);

    return res.status(200).json({
      success: true,
      order,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image,
      },
      gateway: {
        provider: "razorpay",
        keyId: razorpayConfig.keyId,
        merchantName: razorpayConfig.merchantName,
        currency: razorpayConfig.currency,
      },
      user: {
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (err) {
    console.error("Create Gateway Order Error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to create payment order.",
    });
  }
};

const verifyGatewayPayment = async (req, res) => {
  try {
    await ensurePurchaseGatewayColumns();
    ensureGatewayConfigured();

    const { bookId } = req.params;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification details." });
    }

    const { book, ownsBook } = await getBookAndOwnership(req.user.id, bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    if (book.category !== "paid") {
      return res.status(400).json({ success: false, message: "This book is free to read." });
    }

    if (ownsBook) {
      return res.status(200).json({
        success: true,
        message: "This book is already unlocked.",
        book: { id: book.id, title: book.title },
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", razorpayConfig.keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment signature verification failed." });
    }

    await db.execute(
      `INSERT INTO purchases
        (user_id, book_id, amount, payment_status, payment_provider, gateway_order_id, gateway_payment_id)
       VALUES (?, ?, ?, 'completed', 'razorpay', ?, ?)
       ON DUPLICATE KEY UPDATE
         amount = VALUES(amount),
         payment_status = 'completed',
         payment_provider = 'razorpay',
         gateway_order_id = VALUES(gateway_order_id),
         gateway_payment_id = VALUES(gateway_payment_id)`,
      [req.user.id, bookId, book.price, razorpay_order_id, razorpay_payment_id],
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and book unlocked.",
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
      },
    });
  } catch (err) {
    console.error("Verify Gateway Payment Error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to verify payment.",
    });
  }
};

const purchaseBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    const book = books[0];
    const [existing] = await db.execute(
      "SELECT id FROM purchases WHERE user_id = ? AND book_id = ?",
      [userId, bookId],
    );

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "You already own this book." });
    }

    if (book.category === "paid") {
      return res.status(400).json({
        success: false,
        requiresGatewayPayment: true,
        message: "Use the secure Razorpay checkout to purchase this premium book.",
      });
    }

    await ensurePurchaseGatewayColumns();
    await db.execute(
      `INSERT INTO purchases
        (user_id, book_id, amount, payment_status, payment_provider, gateway_order_id, gateway_payment_id)
       VALUES (?, ?, ?, 'completed', 'free', '', '')`,
      [userId, bookId, book.price],
    );

    return res.status(201).json({
      success: true,
      message: `"${book.title}" added to your library.`,
      book: { id: book.id, title: book.title, author: book.author },
    });
  } catch (err) {
    console.error("Purchase Error:", err);
    return res.status(500).json({ success: false, message: "Purchase failed. Try again." });
  }
};

const getMyBooks = async (req, res) => {
  try {
    const [books] = await db.execute(
      `SELECT b.*, p.purchased_at, p.payment_provider, p.gateway_payment_id
       FROM books b
       JOIN purchases p ON b.id = p.book_id
       WHERE p.user_id = ?
       ORDER BY p.purchased_at DESC`,
      [req.user.id],
    );

    return res.status(200).json({ success: true, count: books.length, books });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch your books." });
  }
};

const checkOwnership = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id FROM purchases WHERE user_id = ? AND book_id = ?",
      [req.user.id, req.params.bookId],
    );

    return res.status(200).json({
      success: true,
      owned: rows.length > 0,
      pending: false,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to check ownership." });
  }
};

const getPaymentRequests = async (req, res) => {
  try {
    await ensurePurchaseGatewayColumns();

    const [rows] = await db.execute(
      `SELECT
         p.id,
         p.user_id,
         p.book_id,
         p.amount,
         p.payment_status AS status,
         p.payment_provider,
         p.payment_provider AS payment_method,
         p.gateway_order_id,
         p.gateway_payment_id,
         p.gateway_payment_id AS reference_id,
         '' AS payer_contact,
         '' AS payer_upi_id,
         '' AS note,
         p.purchased_at AS created_at,
         u.name AS user_name,
         u.email AS user_email,
         b.title AS book_title,
         b.author AS book_author
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN books b ON p.book_id = b.id
       WHERE p.payment_provider = 'razorpay'
       ORDER BY p.purchased_at DESC`,
    );

    return res.status(200).json({ success: true, count: rows.length, requests: rows });
  } catch (err) {
    console.error("Get Payment Requests Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch payment purchases." });
  }
};

const updatePaymentRequestStatus = async (req, res) => {
  return res.status(400).json({
    success: false,
    message: "Manual approval is disabled. Razorpay payments unlock books automatically after verification.",
  });
};

module.exports = {
  getCheckoutInfo,
  createGatewayOrder,
  verifyGatewayPayment,
  purchaseBook,
  getMyBooks,
  checkOwnership,
  getPaymentRequests,
  updatePaymentRequestStatus,
};
