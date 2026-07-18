import { useEffect, useState } from "react";

import { FaTrash } from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import "../styles/Comments.css";

function TaskComments({ taskId }) {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/task/${taskId}`);

      setComments(res.data.comments);
    } catch (error) {
      toast.error("Unable to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addComment = async () => {
    if (!message.trim()) return;

    try {
      await api.post(
        "/comments",

        {
          task: taskId,

          message,
        },
      );

      setMessage("");

      fetchComments();

      toast.success("Comment added");
    } catch (error) {
      toast.error("Comment failed");
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);

      fetchComments();
    } catch (error) {
      toast.error("Delete failed");
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

        <button onClick={addComment}>Send</button>
      </div>

      <div className="comments-list">
        {comments.map((comment) => (
          <div className="comment" key={comment._id}>
            <div>
              <strong>{comment.user?.name}</strong>

              <p>{comment.message}</p>
            </div>

            {(comment.user?._id === user?._id || user?.role === "Admin") && (
              <FaTrash onClick={() => deleteComment(comment._id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskComments;
