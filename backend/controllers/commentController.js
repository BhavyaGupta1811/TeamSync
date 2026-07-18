const Comment = require("../models/Comment");

// Add Comment
const addComment = async (req, res) => {
  try {
    let { task, message } = req.body;

    message = message?.trim();

    if (!task || !message) {
      return res.status(400).json({
        success: false,
        message: "Task and message are required",
      });
    }

    const comment = await Comment.create({
      task,
      user: req.user._id,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added",
      comment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Task Comments
const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    }).populate("user", "name role");

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only comment owner or Admin can delete
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
  } catch (error) {
    console.error("Delete Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getTaskComments,
  deleteComment,
};
