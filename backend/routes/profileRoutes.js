const express = require("express");

const {
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Update Profile
router.put("/update", protect, updateProfile);

module.exports = router;
