import { useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";

import "../styles/Modal.css";

function DeleteProject({ project, close, refresh }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!project?._id) {
      toast.error("Invalid project.");
      return;
    }

    try {
      setLoading(true);

      await api.delete(`/projects/${project._id}`);

      toast.success("Project deleted successfully.");

      refresh();
      close();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to delete project.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box delete-modal">
        <div className="modal-head">
          <h2>Delete Project</h2>

          <FaTimes
            className="close-icon"
            onClick={!loading ? close : undefined}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          />
        </div>

        <div className="delete-content">
          <FaExclamationTriangle className="delete-icon" />

          <h3>Are you sure?</h3>

          <p>
            You are about to permanently delete
            <strong> "{project?.title}"</strong>.
          </p>

          <p>This action cannot be undone.</p>

          <div className="delete-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={close}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="danger-btn"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteProject;
