const Project = require("../models/Project");
const Task = require("../models/Task");

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.countDocuments();

    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      status: {
        $in: ["Todo", "In Progress"],
      },
    });

    const overdueTasks = await Task.countDocuments({
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

// Task Status Chart Data
const getTaskChartData = async (req, res) => {
  try {
    const todo = await Task.countDocuments({
      status: "Todo",
    });

    const inProgress = await Task.countDocuments({
      status: "In Progress",
    });

    const completed = await Task.countDocuments({
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
