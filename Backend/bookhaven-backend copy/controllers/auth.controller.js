const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const db     = require("../config/db");

// ── Register ─────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ success: false, message: "Invalid email format." });

    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: "This email is already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email: email.toLowerCase() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      success: true,
      message: `Welcome to BookHaven, ${name.trim()}! 📚`,
      token,
      user: { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim(), role: "user" }
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ success: false, message: "Registration failed. Try again." });
  }
};

// ── Login ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const user    = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Login failed. Try again." });
  }
};

// ── Get Profile ───────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const [user]      = await db.execute("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [req.user.id]);
    const [purchases] = await db.execute("SELECT COUNT(*) AS cnt FROM purchases WHERE user_id = ?", [req.user.id]);
    const [progress]  = await db.execute("SELECT COUNT(*) AS cnt FROM reading_progress WHERE user_id = ?", [req.user.id]);

    return res.status(200).json({
      success: true,
      user: {
        ...user[0],
        purchasedBooksCount: purchases[0].cnt,
        booksRead          : progress[0].cnt
      }
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    return res.status(500).json({ success: false, message: "Failed to get profile." });
  }
};

// ── Update Profile ────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required." });

    await db.execute("UPDATE users SET name = ? WHERE id = ?", [name.trim(), req.user.id]);

    return res.status(200).json({ success: true, message: "Profile updated!", user: { ...req.user, name: name.trim() } });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update profile." });
  }
};

module.exports = { register, login, getProfile, updateProfile };
