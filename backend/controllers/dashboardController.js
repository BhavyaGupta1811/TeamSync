const Project = require("../models/Project");
const Task = require("../models/Task");

// Get Dashboard Data based on user role
const getDashboardStats = async (req, res) => {
  try {
    let projectQuery = {};
    let taskQuery = {};

    // Admin -> everything
    if (req.user.role === "Admin") {
      projectQuery = {};

      taskQuery = {};
    }

    // Project Manager -> only managed projects
    else if (req.user.role === "Project Manager") {
      const projects = await Project.find({
        manager: req.user._id,
      }).select("_id");

      const projectIds = projects.map((project) => project._id);

      projectQuery = {
        manager: req.user._id,
      };

      taskQuery = {
        project: {
          $in: projectIds,
        },
      };
    }

    // Team Member -> assigned tasks only
    else {
      projectQuery = {
        teamMembers: req.user._id,
      };

      taskQuery = {
        assignedTo: req.user._id,
      };
    }

    const projects = await Project.countDocuments(projectQuery);

    const completedTasks = await Task.countDocuments({
      ...taskQuery,
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      ...taskQuery,

      status: {
        $in: ["Todo", "In Progress"],
      },
    });

    const overdueTasks = await Task.countDocuments({
      ...taskQuery,

      dueDate: {
        $lt: new Date(),
      },

      status: {
        $ne: "Completed",
      },
    });

    res.status(200).json({
      success: true,

      stats: {
        projects,

        completedTasks,

        pendingTasks,

        overdueTasks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Chart Data
const getTaskChartData = async (req, res) => {
  try {
    let taskQuery = {};

    // Admin
    if (req.user.role === "Admin") {
      taskQuery = {};
    }

    // Manager
    else if (req.user.role === "Project Manager") {
      const projects = await Project.find({
        manager: req.user._id,
      }).select("_id");

      const projectIds = projects.map((project) => project._id);

      taskQuery = {
        project: {
          $in: projectIds,
        },
      };
    }

    // Member
    else {
      taskQuery = {
        assignedTo: req.user._id,
      };
    }

    const todo = await Task.countDocuments({
      ...taskQuery,

      status: "Todo",
    });

    const inProgress = await Task.countDocuments({
      ...taskQuery,

      status: "In Progress",
    });

    const completed = await Task.countDocuments({
      ...taskQuery,

      status: "Completed",
    });

    res.status(200).json({
      success: true,

      chart: {
        labels: ["Todo", "In Progress", "Completed"],

        values: [todo, inProgress, completed],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getTaskChartData,
};
