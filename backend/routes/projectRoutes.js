const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Project
router.post("/", protect, authorize("Admin", "Project Manager"), createProject);

// Get All Projects
router.get("/", protect, getProjects);

// Get Single Project
router.get("/:id", protect, getProjectById);

// Update Project
router.put(
  "/:id",
  protect,
  authorize("Admin", "Project Manager"),
  updateProject,
);

// Delete Project
router.delete("/:id", protect, authorize("Admin"), deleteProject);

module.exports = router;
