const db = require("../config/db");

// ── Submit / update feedback ──────────────────────────────────────
const submitFeedback = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId     = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });

    const [books] = await db.execute("SELECT id FROM books WHERE id = ?", [bookId]);
    if (books.length === 0) return res.status(404).json({ success: false, message: "Book not found." });

    await db.execute(
      `INSERT INTO feedback (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
      [userId, bookId, parseInt(rating), comment?.trim() || ""]
    );

    // Recalculate average rating on book
    const [avg] = await db.execute(
      "SELECT AVG(rating) AS avg_r, COUNT(*) AS total FROM feedback WHERE book_id = ?",
      [bookId]
    );
    await db.execute(
      "UPDATE books SET rating = ?, total_ratings = ? WHERE id = ?",
      [parseFloat(avg[0].avg_r || 0).toFixed(2), avg[0].total, bookId]
    );

    return res.status(201).json({ success: true, message: "Review submitted! Thank you ⭐" });
  } catch (err) {
    console.error("Submit Feedback Error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit review." });
  }
};

// ── Get feedback for a book ───────────────────────────────────────
const getBookFeedback = async (req, res) => {
  try {
    const { bookId } = req.params;

    const [rows] = await db.execute(
      `SELECT f.id, f.user_id, f.rating, f.comment, f.created_at, u.name AS user_name
       FROM feedback f JOIN users u ON f.user_id = u.id
       WHERE f.book_id = ? ORDER BY f.created_at DESC`,
      [bookId]
    );

    const [stats] = await db.execute(
      "SELECT AVG(rating) AS avg_r, COUNT(*) AS total FROM feedback WHERE book_id = ?",
      [bookId]
    );

    return res.status(200).json({
      success : true,
      feedback: rows,
      stats   : { avgRating: parseFloat(stats[0].avg_r || 0).toFixed(1), totalRatings: stats[0].total }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews." });
  }
};

// ── Contact form ──────────────────────────────────────────────────
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "Name, email and message are required." });

    await db.execute(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), subject?.trim() || "", message.trim()]
    );

    return res.status(201).json({ success: true, message: "Message sent! We'll reply soon. 📧" });
  } catch (err) {
    console.error("Contact Error:", err);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
};

module.exports = { submitFeedback, getBookFeedback, submitContact };
