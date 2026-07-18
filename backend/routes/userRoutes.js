const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorize("Admin"), getAllUsers);
router.get("/:id", protect, authorize("Admin"), getUserById);
router.put("/:id", protect, authorize("Admin"), updateUser);
router.delete("/:id", protect, authorize("Admin"), deleteUser);

module.exports = router;
