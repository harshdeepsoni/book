const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    // Request ke header mein token dhundho
    // Frontend token bhejta hai: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please login karo pehle!" });
    }

    // "Bearer token123" mein se sirf token nikalo
    const token = authHeader.split(" ")[1];

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token se user ID nikalo aur user dhundho DB mein
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User nahi mila!" });
    }

    // User ko request mein attach karo taaki agle function use kar sake
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token galat hai ya expire ho gaya!" });
  }
};

module.exports = protect;
