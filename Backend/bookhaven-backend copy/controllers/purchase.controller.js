const db = require("../config/db");

const paymentConfig = {
  merchantName: process.env.MERCHANT_NAME || "BookHaven Store",
  upiId: process.env.UPI_ID || "bookhaven@upi",
  bankName: process.env.BANK_NAME || "State Bank of India",
  accountName: process.env.ACCOUNT_NAME || "BookHaven",
  accountNumber: process.env.ACCOUNT_NUMBER || "0000000000000000",
  ifsc: process.env.IFSC_CODE || "SBIN0000000",
};

const ensurePaymentRequestsTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS payment_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      book_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      payment_method ENUM('upi','bank_transfer','qr_scan') NOT NULL DEFAULT 'upi',
      payer_name VARCHAR(120) NOT NULL,
      payer_contact VARCHAR(120) DEFAULT '',
      payer_upi_id VARCHAR(150) DEFAULT '',
      reference_id VARCHAR(150) NOT NULL,
      note TEXT,
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      UNIQUE KEY unique_reference (reference_id),
      KEY idx_payment_request_book_user (book_id, user_id)
    )
  `);
};

const buildPaymentPayload = (book) => {
  const amount = Number(book.price || 0).toFixed(2);
  const upiLink =
    `upi://pay?pa=${encodeURIComponent(paymentConfig.upiId)}` +
    `&pn=${encodeURIComponent(paymentConfig.merchantName)}` +
    `&am=${encodeURIComponent(amount)}` +
    `&cu=INR&tn=${encodeURIComponent(`Payment for ${book.title}`)}`;

  return {
    ...paymentConfig,
    amount,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiLink)}`,
    upiLink,
  };
};

const getBookAndOwnership = async (userId, bookId) => {
  const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [bookId]);
  if (books.length === 0) {
    return { book: null, ownsBook: false, pendingRequest: null };
  }

  const [purchaseRows] = await db.execute(
    "SELECT id, payment_status FROM purchases WHERE user_id = ? AND book_id = ?",
    [userId, bookId],
  );

  const [requestRows] = await db.execute(
    `SELECT id, status, payment_method, reference_id, created_at
     FROM payment_requests
     WHERE user_id = ? AND book_id = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId, bookId],
  );

  return {
    book: books[0],
    ownsBook: purchaseRows.length > 0,
    pendingRequest: requestRows[0] || null,
  };
};

const getPaymentConfig = async (req, res) => {
  try {
    const { bookId } = req.params;
    const [books] = await db.execute("SELECT id, title, price, category FROM books WHERE id = ?", [bookId]);

    if (books.length === 0) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    const book = books[0];
    if (book.category !== "paid") {
      return res.status(400).json({ success: false, message: "This book does not require payment." });
    }

    return res.status(200).json({
      success: true,
      payment: buildPaymentPayload(book),
    });
  } catch (err) {
    console.error("Get Payment Config Error:", err);
    return res.status(500).json({ success: false, message: "Failed to load payment details." });
  }
};

const getCheckoutInfo = async (req, res) => {
  try {
    await ensurePaymentRequestsTable();

    const { bookId } = req.params;
    const { book, ownsBook, pendingRequest } = await getBookAndOwnership(req.user.id, bookId);

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
      pending: pendingRequest?.status === "pending",
      paymentRequest: pendingRequest,
      payment: buildPaymentPayload(book),
    });
  } catch (err) {
    console.error("Checkout Info Error:", err);
    return res.status(500).json({ success: false, message: "Failed to load checkout details." });
  }
};

const submitManualPayment = async (req, res) => {
  try {
    await ensurePaymentRequestsTable();

    const { bookId } = req.params;
    const userId = req.user.id;
    const {
      paymentMethod,
      payerName,
      payerContact = "",
      payerUpiId = "",
      referenceId,
      note = "",
    } = req.body;

    if (!paymentMethod || !payerName || !referenceId) {
      return res.status(400).json({
        success: false,
        message: "Payment method, payer name, and reference id are required.",
      });
    }

    const allowedMethods = ["upi", "bank_transfer", "qr_scan"];
    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Unsupported payment method." });
    }

    const { book, ownsBook, pendingRequest } = await getBookAndOwnership(userId, bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    if (book.category !== "paid") {
      return res.status(400).json({ success: false, message: "This book is free to read." });
    }

    if (ownsBook) {
      return res.status(409).json({ success: false, message: "You already own this book." });
    }

    if (pendingRequest?.status === "pending") {
      return res.status(409).json({
        success: false,
        message: "Your payment request is already pending verification.",
      });
    }

    await db.execute(
      `INSERT INTO payment_requests
        (user_id, book_id, amount, payment_method, payer_name, payer_contact, payer_upi_id, reference_id, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        bookId,
        book.price,
        paymentMethod,
        payerName.trim(),
        payerContact.trim(),
        payerUpiId.trim(),
        referenceId.trim(),
        note.trim(),
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Payment request submitted. We will verify it and unlock the book.",
      pending: true,
    });
  } catch (err) {
    console.error("Submit Manual Payment Error:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This transaction reference already exists. Please use a unique reference id.",
      });
    }

    return res.status(500).json({ success: false, message: "Failed to submit payment request." });
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
      await ensurePaymentRequestsTable();
      const [pendingRows] = await db.execute(
        "SELECT id FROM payment_requests WHERE user_id = ? AND book_id = ? AND status = 'pending'",
        [userId, bookId],
      );

      return res.status(400).json({
        success: false,
        requiresManualPayment: true,
        pending: pendingRows.length > 0,
        message:
          pendingRows.length > 0
            ? "Your payment request is pending verification."
            : "Use QR, UPI, or bank transfer to submit a payment request for this premium book.",
      });
    }

    await db.execute(
      "INSERT INTO purchases (user_id, book_id, amount) VALUES (?, ?, ?)",
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
      `SELECT b.*, p.purchased_at
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
    await ensurePaymentRequestsTable();

    const [rows] = await db.execute(
      "SELECT id FROM purchases WHERE user_id = ? AND book_id = ?",
      [req.user.id, req.params.bookId],
    );
    const [pendingRows] = await db.execute(
      "SELECT id FROM payment_requests WHERE user_id = ? AND book_id = ? AND status = 'pending'",
      [req.user.id, req.params.bookId],
    );

    return res.status(200).json({
      success: true,
      owned: rows.length > 0,
      pending: pendingRows.length > 0,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to check ownership." });
  }
};

module.exports = {
  getPaymentConfig,
  getCheckoutInfo,
  submitManualPayment,
  purchaseBook,
  getMyBooks,
  checkOwnership,
};
