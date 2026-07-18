import { FaTimes } from "react-icons/fa";

import "../styles/Modal.css";

function ViewProject({ project, close }) {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-head">
          <h2>Project Details</h2>

          <FaTimes className="close-icon" onClick={close} />
        </div>

        <div className="project-view">
          <div className="view-section">
            <h3>Title</h3>
            <p>{project?.title}</p>
          </div>

          <div className="view-section">
            <h3>Description</h3>
            <p>{project?.description}</p>
          </div>

          <div className="view-section">
            <h3>Project Manager</h3>
            <p>{project?.manager?.name || "-"}</p>
          </div>

          <div className="view-section">
            <h3>Team Members</h3>

            {project?.teamMembers?.length > 0 ? (
              <ul className="member-list">
                {project.teamMembers.map((member) => (
                  <li key={member._id}>{member.name}</li>
                ))}
              </ul>
            ) : (
              <p>No team members assigned.</p>
            )}
          </div>

          <div className="view-row">
            <div className="view-section">
              <h3>Start Date</h3>
              <p>{formatDate(project?.startDate)}</p>
            </div>

            <div className="view-section">
              <h3>End Date</h3>
              <p>{formatDate(project?.endDate)}</p>
            </div>
          </div>

          <div className="view-row">
            <div className="view-section">
              <h3>Created</h3>
              <p>{formatDate(project?.createdAt)}</p>
            </div>

            <div className="view-section">
              <h3>Last Updated</h3>
              <p>{formatDate(project?.updatedAt)}</p>
            </div>
          </div>

          <button
            type="button"
            className="primary-btn  modal-close-btn"
            onClick={close}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProject;
