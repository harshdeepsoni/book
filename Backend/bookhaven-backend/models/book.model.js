const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book ka title zaroori hai"],
      trim: true,
    },

    author: {
      type: String,
      required: [true, "Author ka naam zaroori hai"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    genre: {
      type: String,
      required: true,
      // Example: "Fiction", "Non-Fiction", "Mystery", etc.
    },

    category: {
      type: String,
      enum: ["free", "paid"],    // Sirf yahi do values allowed hain
      required: true,
    },

    price: {
      type: Number,
      default: 0,                // Free books ke liye 0
    },

    image: {
      type: String,
      default: "",               // Book cover image URL
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
