const express = require("express");

const {
  createTask,
  getTasks,
  getProjectTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Task
router.post("/", protect, authorize("Admin", "Project Manager"), createTask);

// Get All Tasks
router.get("/", protect, getTasks);

// Get Tasks By Project
router.get("/project/:projectId", protect, getProjectTasks);

// Update Task Status (Kanban)
router.patch("/:id/status", protect, updateTaskStatus);

// Update Task
router.put("/:id", protect, authorize("Admin", "Project Manager"), updateTask);

// Delete Task
router.delete(
  "/:id",
  protect,
  authorize("Admin", "Project Manager"),
  deleteTask,
);

module.exports = router;
