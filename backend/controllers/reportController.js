const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// Admin Reports
const getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProjects = await Project.countDocuments();

    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    const pendingTasks = await Task.countDocuments({
      status: {
        $ne: "Completed",
      },
    });

    res.status(200).json({
      success: true,

      reports: {
        totalUsers,
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
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
  getReports,
};
