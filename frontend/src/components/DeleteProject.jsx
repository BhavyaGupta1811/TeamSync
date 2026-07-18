import { useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../services/api";

import "../styles/Modal.css";

function DeleteTask({ task, close, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!task?._id) {
      toast.error("Invalid task.");
      return;
    }

    try {
      setLoading(true);

      await api.delete(`/tasks/${task._id}`);

      toast.success("Task deleted successfully.");

      refresh();
      close();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box delete-modal">
        <div className="modal-head">
          <h2>Delete Task</h2>

          <FaTimes
            className="close-icon"
            onClick={!loading ? close : undefined}
          />
        </div>

        <div className="delete-content">
          <FaExclamationTriangle className="delete-icon" />

          <h3>Are you sure?</h3>

          <p>
            You are about to permanently delete
            <strong> "{task?.title}"</strong>.
          </p>

          <p>This action cannot be undone.</p>

          <div className="delete-actions">
            <button
              className="secondary-btn"
              onClick={close}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className="danger-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteTask;
