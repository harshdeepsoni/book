const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Naam zaroori hai"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,               // Ek email ek hi baar register ho sakti hai
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: [6, "Password kam se kam 6 characters ka hona chahiye"],
    },

    // User ne jo books purchase ki hain unka list
    purchasedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically add hoga
  }
);

module.exports = mongoose.model("User", userSchema);
