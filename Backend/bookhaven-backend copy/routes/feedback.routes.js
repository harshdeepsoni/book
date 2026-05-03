const express = require("express");
const router  = express.Router();
const { submitFeedback, getBookFeedback, submitContact } = require("../controllers/feedback.controller");
const { verifyToken } = require("../middleware/auth");

// NOTE: /contact/send before /:bookId
router.post("/contact/send", submitContact);
router.get ("/:bookId",      getBookFeedback);
router.post("/:bookId",      verifyToken, submitFeedback);

module.exports = router;
