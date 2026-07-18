import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Comments.css";

function TaskComments({ taskId }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/task/${taskId}`);
      setComments(res.data.comments || []);
    } catch (error) {
      toast.error("Unable to load comments.");
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId]);

  const addComment = async () => {
    if (!message.trim()) return;

    try {
      await api.post("/comments", {
        task: taskId,
        message: message.trim(),
      });

      setMessage("");

      fetchComments();

      toast.success("Comment added.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed.");
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);

      fetchComments();

      toast.success("Comment deleted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="comments-box">
      <h3>Discussion</h3>

      <div className="comment-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment"
        />

        <button type="button" onClick={addComment}>
          Send
        </button>
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className="comment" key={comment._id}>
              <div>
                <strong>{comment.user?.name}</strong>

                <p>{comment.message}</p>
              </div>

              {(comment.user?._id === user?._id || user?.role === "Admin") && (
                <FaTrash
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteComment(comment._id)}
                />
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default TaskComments;
