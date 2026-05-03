const express = require("express");
const router  = express.Router();
const {
  getCheckoutInfo,
  createGatewayOrder,
  verifyGatewayPayment,
  purchaseBook,
  getMyBooks,
  checkOwnership,
  getPaymentRequests,
  updatePaymentRequestStatus,
} = require("../controllers/purchase.controller");
const { verifyToken, isAdmin } = require("../middleware/auth");

// NOTE: specific paths BEFORE /:bookId to avoid conflicts
router.get ("/checkout/:bookId",      verifyToken, getCheckoutInfo);
router.get ("/admin/requests",        verifyToken, isAdmin, getPaymentRequests);
router.get ("/my-books",       verifyToken, getMyBooks);
router.get ("/check/:bookId",  verifyToken, checkOwnership);
router.put ("/admin/requests/:requestId", verifyToken, isAdmin, updatePaymentRequestStatus);
router.post("/create-order/:bookId", verifyToken, createGatewayOrder);
router.post("/verify/:bookId", verifyToken, verifyGatewayPayment);
router.post("/:bookId",        verifyToken, purchaseBook);

module.exports = router;
