const jwt = require("jsonwebtoken");
const db   = require("../config/db");

// ── Require valid JWT ────────────────────────────────────────────
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access denied. Please login." });
    }
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.execute(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "User not found." });
    }
    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// ── Attach user if token present (does NOT block) ────────────────
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token   = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (_) { /* ignore */ }
  }
  next();
};

// ── Admin only ───────────────────────────────────────────────────
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};

module.exports = { verifyToken, optionalAuth, isAdmin };
