const Project = require("../models/Project");
const Task = require("../models/Task");

// Create Project
const createProject = async (req, res) => {
  try {
    let { title, description, startDate, endDate, teamMembers } = req.body;

    title = title?.trim();
    description = description?.trim();

    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Title, start date and end date are required",
      });
    }

    // Validate dates
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      manager: req.user._id,
      teamMembers,
    });

    const createdProject = await Project.findById(project._id)
      .populate("manager", "name email role")
      .populate("teamMembers", "name email role");

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: createdProject,
    });
  } catch (error) {
    console.error("Create Project Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("manager", "name email role")
      .populate("teamMembers", "name email role");

    const projectsWithStatus = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({
          project: project._id,
        }).select("status");

        let status = "Active";

        if (
          tasks.length > 0 &&
          tasks.every((task) => task.status === "Completed")
        ) {
          status = "Completed";
        }

        return {
          ...project.toObject(),
          status,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((task) => task.status === "Completed")
            .length,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      count: projectsWithStatus.length,
      projects: projectsWithStatus,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("manager", "name email role")
      .populate("teamMembers", "name email role");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const tasks = await Task.find({
      project: project._id,
    }).select("status");

    let status = "Active";

    if (
      tasks.length > 0 &&
      tasks.every((task) => task.status === "Completed")
    ) {
      status = "Completed";
    }

    return res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        status,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task) => task.status === "Completed")
          .length,
      },
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    let { title, description, startDate, endDate, teamMembers } = req.body;

    title = title?.trim();
    description = description?.trim();

    const newStartDate =
      startDate !== undefined ? new Date(startDate) : project.startDate;

    const newEndDate =
      endDate !== undefined ? new Date(endDate) : project.endDate;

    if (newEndDate < newStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (teamMembers !== undefined) project.teamMembers = teamMembers;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("manager", "name email role")
      .populate("teamMembers", "name email role");

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
