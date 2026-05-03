const express = require("express");
const router  = express.Router();
const {
  getPaymentConfig,
  getCheckoutInfo,
  submitManualPayment,
  purchaseBook,
  getMyBooks,
  checkOwnership,
} = require("../controllers/purchase.controller");
const { verifyToken } = require("../middleware/auth");

// NOTE: specific paths BEFORE /:bookId to avoid conflicts
router.get ("/payment-config/:bookId", verifyToken, getPaymentConfig);
router.get ("/checkout/:bookId",      verifyToken, getCheckoutInfo);
router.get ("/my-books",       verifyToken, getMyBooks);
router.get ("/check/:bookId",  verifyToken, checkOwnership);
router.post("/manual/:bookId", verifyToken, submitManualPayment);
router.post("/:bookId",        verifyToken, purchaseBook);

module.exports = router;
