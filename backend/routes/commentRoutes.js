const express = require("express");

const {
  addComment,
  getTaskComments,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add Comment
router.post("/", protect, addComment);

// Get Comments Of Task
router.get("/task/:taskId", protect, getTaskComments);

// Delete Comment
router.delete("/:id", protect, deleteComment);

module.exports = router;
