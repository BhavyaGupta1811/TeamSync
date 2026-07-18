const express = require("express");

const { getReports } = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin Reports
router.get("/", protect, authorize("Admin"), getReports);

module.exports = router;
