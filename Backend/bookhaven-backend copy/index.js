const express = require("express");
const cors    = require("cors");
const dotenv  = require("dotenv");

dotenv.config();

// Initialize DB connection (runs on require)
require("./config/db");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/books",    require("./routes/book.routes"));
app.use("/api/purchase", require("./routes/purchase.routes"));
app.use("/api/feedback", require("./routes/feedback.routes"));

// ─── Health Check ─────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message  : "📚 BookHaven API is Running 🚀",
    status   : "OK",
    timestamp: new Date().toISOString()
  });
});

// ─── Global Error Handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ─── Start Server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  BookHaven server running → http://localhost:${PORT}`);
  console.log(`📋  API Docs:`);
  console.log(`      POST  /api/auth/register`);
  console.log(`      POST  /api/auth/login`);
  console.log(`      GET   /api/books`);
  console.log(`      GET   /api/books/free`);
  console.log(`      GET   /api/books/:id/read`);
  console.log(`      POST  /api/purchase/:bookId`);
  console.log(`      POST  /api/feedback/:bookId\n`);
});
