const Order = require("../models/order.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");

// ─── BOOK PURCHASE KARO ──────────────────────────────────────────────
// POST /api/orders
// (Protected - login hona zaroori)
const purchaseBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id; // Auth middleware se aaya

    // Book dhundho
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book nahi mili!" });
    }

    // Free book ke liye order banana zaroori nahi
    if (book.category === "free") {
      return res.status(400).json({ message: "Yeh book free hai, seedha padho!" });
    }

    // Check karo kya user ne pehle se yeh book purchase ki hai
    const alreadyPurchased = await Order.findOne({ user: userId, book: bookId });
    if (alreadyPurchased) {
      return res.status(400).json({ message: "Yeh book tumne pehle se purchase ki hui hai!" });
    }

    // Order save karo
    const order = await Order.create({
      user: userId,
      book: bookId,
      amount: book.price,
    });

    // User ke purchasedBooks mein bhi add karo
    await User.findByIdAndUpdate(userId, {
      $push: { purchasedBooks: bookId },
    });

    res.status(201).json({
      message: "Book purchase ho gayi! 🎉",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ─── MERI PURCHASES DEKHO ────────────────────────────────────────────
// GET /api/orders/mine
// (Protected - login hona zaroori)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("book")    // Book ki poori detail attach karo
      .sort({ createdAt: -1 }); // Nayi pehle

    res.status(200).json({
      count: orders.length,
      orders,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { purchaseBook, getMyOrders };
