const express = require("express");
const router  = express.Router();
const { getAllBooks, getFreeBooks, getBookById, getBookForReading, getGenres } = require("../controllers/book.controller");
const { optionalAuth } = require("../middleware/auth");

router.get("/",         getAllBooks);
router.get("/free",     getFreeBooks);
router.get("/genres",   getGenres);
router.get("/:id",      getBookById);
router.get("/:id/read", optionalAuth, getBookForReading);  // optionalAuth so free books work for guests

module.exports = router;
