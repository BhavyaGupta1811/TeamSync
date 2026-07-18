const express = require("express");

const {
  getDashboardStats,
  getTaskChartData,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard Stats
router.get("/stats", protect, getDashboardStats);

// Chart Data
router.get("/chart", protect, getTaskChartData);

module.exports = router;
