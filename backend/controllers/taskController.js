const Task = require("../models/Task");
const Notification = require("../models/Notification");
// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate, status } =
      req.body;

    // Check project exists
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Project Manager -> Can only create tasks in managed projects
    if (
      req.user.role === "Project Manager" &&
      existingProject.manager.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Ensure assigned user belongs to the project team
    const isTeamMember = existingProject.teamMembers.some(
      (member) => member.toString() === assignedTo,
    );

    if (!isTeamMember) {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a member of this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
      status,
    });

    // Create notification for assigned user

    await Notification.create({
      user: assignedTo,

      message: `You have been assigned a new task: ${title}`,

      type: "Task",
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tasks

// Get Tasks
const getTasks = async (req, res) => {
  try {
    let tasks = [];

    // Admin -> All Tasks
    if (req.user.role === "Admin") {
      tasks = await Task.find()
        .populate("project", "title")
        .populate("assignedTo", "name email role")
        .populate("assignedBy", "name email role");
    }

    // Project Manager -> Tasks of projects managed by them
    else if (req.user.role === "Project Manager") {
      const projects = await Project.find({
        manager: req.user._id,
      }).select("_id");

      const projectIds = projects.map((project) => project._id);

      tasks = await Task.find({
        project: { $in: projectIds },
      })
        .populate("project", "title")
        .populate("assignedTo", "name email role")
        .populate("assignedBy", "name email role");
    }

    // Team Member -> Only assigned tasks
    else {
      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate("project", "title")
        .populate("assignedTo", "name email role")
        .populate("assignedBy", "name email role");
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Tasks By Project
const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (req.user.role === "Project Manager") {
      if (project.manager.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    if (req.user.role === "Team Member") {
      const isMember = project.teamMembers.some(
        (member) => member.toString() === req.user._id.toString(),
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    const tasks = await Task.find({
      project: req.params.projectId,
    })
      .populate("assignedTo", "name email role")
      .populate("assignedBy", "name email role")
      .populate("project", "title");

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Task Status
const Project = require("../models/Project");

// Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Admin -> Can update any task
    if (req.user.role !== "Admin") {
      // Project Manager -> Only tasks of managed projects
      if (req.user.role === "Project Manager") {
        const project = await Project.findById(task.project);

        if (
          !project ||
          project.manager.toString() !== req.user._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            message: "Not authorized",
          });
        }
      }

      // Team Member -> Only assigned tasks
      else if (req.user.role === "Team Member") {
        if (task.assignedTo.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "Not authorized",
          });
        }
      }
    }

    task.status = status;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Project Manager -> Only tasks of managed projects
    if (req.user.role === "Project Manager") {
      const project = await Project.findById(task.project);

      if (
        !project ||
        project.manager.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    const {
      title,
      description,
      assignedTo,
      dueDate,
      status,
    } = req.body;

    task.title = title || task.title;
    task.description = description || task.description;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Project Manager -> Only tasks of managed projects
    if (req.user.role === "Project Manager") {
      const project = await Project.findById(task.project);

      if (
        !project ||
        project.manager.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getProjectTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
};
