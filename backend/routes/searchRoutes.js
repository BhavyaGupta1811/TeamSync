const express = require("express");

const { search } = require("../controllers/searchController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Search
router.get("/", protect, search);

module.exports = router;
