const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// Global Search
const search = async (req, res) => {
  try {
    let { query, status } = req.query;

    query = query?.trim();

    const result = {};

    if (query) {
      result.projects = await Project.find({
        title: {
          $regex: query,
          $options: "i",
        },
      });

      result.tasks = await Task.find({
        title: {
          $regex: query,
          $options: "i",
        },
      }).populate("assignedTo", "name email");

      result.users = await User.find({
        name: {
          $regex: query,
          $options: "i",
        },
      }).select("-password");
    }

    if (status) {
      result.tasks = await Task.find({
        status,
      }).populate("assignedTo", "name email");
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Search Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  search,
};
