const db = require("../config/db");

// ── Get all books (with optional filters) ────────────────────────
const getAllBooks = async (req, res) => {
  try {
    const { genre, search, category } = req.query;
    let query = "SELECT * FROM books WHERE 1=1";
    const params = [];

    if (genre)    { query += " AND genre = ?";                      params.push(genre); }
    if (category) { query += " AND category = ?";                   params.push(category); }
    if (search)   { query += " AND (title LIKE ? OR author LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

    query += " ORDER BY created_at DESC";

    const [books] = await db.execute(query, params);
    return res.status(200).json({ success: true, count: books.length, books });
  } catch (err) {
    console.error("Get All Books Error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch books." });
  }
};

// ── Free books ────────────────────────────────────────────────────
const getFreeBooks = async (req, res) => {
  try {
    const [books] = await db.execute("SELECT * FROM books WHERE category = 'free' ORDER BY rating DESC");
    return res.status(200).json({ success: true, count: books.length, books });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch free books." });
  }
};

// ── Single book detail ────────────────────────────────────────────
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
    if (books.length === 0) return res.status(404).json({ success: false, message: "Book not found." });

    const [feedbackRows] = await db.execute(
      `SELECT f.id, f.user_id, f.rating, f.comment, f.created_at, u.name AS user_name
       FROM feedback f JOIN users u ON f.user_id = u.id
       WHERE f.book_id = ? ORDER BY f.created_at DESC LIMIT 20`,
      [id]
    );

    return res.status(200).json({ success: true, book: books[0], feedback: feedbackRows });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch book." });
  }
};

// ── Read book — check access rights ──────────────────────────────
const getBookForReading = async (req, res) => {
  try {
    const { id }  = req.params;
    const userId  = req.user?.id;

    const [books] = await db.execute("SELECT * FROM books WHERE id = ?", [id]);
    if (books.length === 0) return res.status(404).json({ success: false, message: "Book not found." });

    const book = books[0];

    if (book.category === "paid") {
      if (!userId)
        return res.status(401).json({ success: false, message: "Please login to read this book.", requiresLogin: true });

      const [purchase] = await db.execute(
        "SELECT id FROM purchases WHERE user_id = ? AND book_id = ?",
        [userId, id]
      );
      const [pendingRequests] = await db.execute(
        `SELECT id FROM payment_requests
         WHERE user_id = ? AND book_id = ? AND status = 'pending'`,
        [userId, id]
      ).catch(() => [[]]);
      if (purchase.length === 0)
        return res.status(403).json({
          success: false,
          message:
            pendingRequests.length > 0
              ? "Your payment request is pending verification."
              : "Purchase this book to read it.",
          requiresPurchase: true,
          pending: pendingRequests.length > 0,
          book
        });
    }

    // Track reading progress
    if (userId) {
      await db.execute(
        `INSERT INTO reading_progress (user_id, book_id) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE last_read = CURRENT_TIMESTAMP`,
        [userId, id]
      );
    }

    return res.status(200).json({
      success: true,
      book: { id: book.id, title: book.title, author: book.author, pdf_url: book.pdf_url, category: book.category, pages: book.pages, image: book.image }
    });
  } catch (err) {
    console.error("Get Book For Reading Error:", err);
    return res.status(500).json({ success: false, message: "Failed to access book." });
  }
};

// ── Get distinct genres ───────────────────────────────────────────
const getGenres = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT DISTINCT genre FROM books ORDER BY genre");
    return res.status(200).json({ success: true, genres: rows.map(r => r.genre) });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch genres." });
  }
};

module.exports = { getAllBooks, getFreeBooks, getBookById, getBookForReading, getGenres };
