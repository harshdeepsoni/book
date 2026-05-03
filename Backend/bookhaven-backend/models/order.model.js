const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Kisne purchase kiya
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Konsi book purchase ki
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // Kitne mein purchase ki
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // purchasedAt track karne ke liye createdAt use hoga
  }
);

module.exports = mongoose.model("Order", orderSchema);
