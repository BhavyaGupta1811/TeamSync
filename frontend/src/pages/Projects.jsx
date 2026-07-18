import { useEffect, useState, useCallback } from "react";
import {
  FaPlus,
  FaFolderOpen,
  FaUserTie,
  FaUsers,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreateProject from "../components/CreateProject";
import ViewProject from "../components/ViewProject";
import EditProject from "../components/EditProject";
import DeleteProject from "../components/DeleteProject";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/Projects.css";

function Projects() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(false);

  const canManage = user?.role === "Admin" || user?.role === "Project Manager";

  const canDelete = user?.role === "Admin";

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/projects");

      setProjects(res.data.projects || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openView = async (projectId) => {
    try {
      setLoadingProject(true);

      const res = await api.get(`/projects/${projectId}`);

      setSelectedProject(res.data.project);

      setShowView(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load project.");
    } finally {
      setLoadingProject(false);
    }
  };

  const openEdit = (project) => {
    setSelectedProject(project);
    setShowEdit(true);
  };

  const openDelete = (project) => {
    setSelectedProject(project);
    setShowDelete(true);
  };

  const closeAllModals = () => {
    setShowView(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedProject(null);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <Navbar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Manage and track all projects</p>
          </div>

          {canManage && (
            <button className="primary-btn" onClick={() => setShowCreate(true)}>
              <FaPlus />
              Create Project
            </button>
          )}
        </div>

        <div className="project-grid">
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length > 0 ? (
            projects.map((project) => {
              const active = new Date(project.endDate) >= new Date();

              return (
                <div className="project-card" key={project._id}>
                  <div className="project-icon">
                    <FaFolderOpen />
                  </div>

                  <h2>{project.title}</h2>

                  <p>{project.description}</p>

                  <div className="project-detail">
                    <FaUserTie />

                    <span>
                      <strong>Manager:</strong> {project.manager?.name || "N/A"}
                    </span>
                  </div>

                  <div className="project-detail">
                    <FaUsers />

                    <span>
                      <strong>Members:</strong>{" "}
                      {project.teamMembers?.length || 0}
                    </span>
                  </div>

                  <div className="project-detail">
                    <FaCalendarAlt />

                    <span>
                      {formatDate(project.startDate)} -{" "}
                      {formatDate(project.endDate)}
                    </span>
                  </div>

                  <div className="project-footer">
                    <span
                      className={`status ${active ? "active" : "completed"}`}
                    >
                      {active ? "Active" : "Completed"}
                    </span>

                    <div className="project-actions">
                      <button
                        className="view-btn"
                        onClick={() => openView(project._id)}
                        disabled={loadingProject}
                        title="View Project"
                      >
                        <FaEye />
                      </button>

                      {canManage && (
                        <button
                          className="edit-btn"
                          onClick={() => openEdit(project)}
                          title="Edit Project"
                        >
                          <FaEdit />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="delete-btn"
                          onClick={() => openDelete(project)}
                          title="Delete Project"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No projects found.</p>
          )}
        </div>

        {showCreate && (
          <CreateProject
            close={() => setShowCreate(false)}
            refresh={fetchProjects}
          />
        )}

        {showView && selectedProject && !loadingProject && (
          <ViewProject project={selectedProject} close={closeAllModals} />
        )}

        {showEdit && selectedProject && (
          <EditProject
            project={selectedProject}
            close={closeAllModals}
            refresh={fetchProjects}
          />
        )}

        {showDelete && selectedProject && (
          <DeleteProject
            project={selectedProject}
            close={closeAllModals}
            refresh={fetchProjects}
          />
        )}
      </main>
    </div>
  );
}

export default Projects;
