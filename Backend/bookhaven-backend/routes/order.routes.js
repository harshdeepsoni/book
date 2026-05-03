const express = require("express");
const router = express.Router();
const { purchaseBook, getMyOrders } = require("../controllers/order.controller");
const protect = require("../middleware/auth.middleware");

// POST /api/orders        → Book purchase karo (login zaroori)
router.post("/", protect, purchaseBook);

// GET /api/orders/mine    → Meri saari purchases (login zaroori)
router.get("/mine", protect, getMyOrders);

module.exports = router;
