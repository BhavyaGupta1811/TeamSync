import { useEffect, useState, useCallback } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import CreateTask from "../components/CreateTask";
import EditTask from "../components/EditTask";
import TaskComments from "../components/TaskComments";

import { FaPlus, FaGripVertical, FaEdit, FaTrash } from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import { toast } from "react-toastify";

import "../styles/Tasks.css";

function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [dragTask, setDragTask] = useState(null);

  const [selectedProject, setSelectedProject] = useState(
    localStorage.getItem("selectedProject") || "",
  );

  const canManage = user?.role === "Admin" || user?.role === "Project Manager";

  const columns = ["Todo", "In Progress", "Completed"];

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get("/projects");

      const projectList = res.data.projects || [];

      setProjects(projectList);

      const savedProject = localStorage.getItem("selectedProject");

      if (
        savedProject &&
        !projectList.some((project) => project._id === savedProject)
      ) {
        localStorage.removeItem("selectedProject");
        setSelectedProject("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load projects.");
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!selectedProject) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/tasks/project/${selectedProject}`);

      setTasks(res.data.tasks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateStatus = async (status) => {
    if (!dragTask || statusLoading) return;

    try {
      setStatusLoading(true);

      await api.patch(`/tasks/${dragTask}/status`, {
        status,
      });

      toast.success("Task updated successfully.");

      setDragTask(null);

      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed.");
    } finally {
      setStatusLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);

      toast.success("Task deleted successfully.");

      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete task.");
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />

      <Navbar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <h1>Tasks</h1>
            <p>Manage project tasks</p>
          </div>

          {canManage && (
            <button
              className="primary-btn"
              disabled={!selectedProject}
              onClick={() => setShowModal(true)}
            >
              <FaPlus />
              Add Task
            </button>
          )}
        </div>

        <select
          className="project-select"
          value={selectedProject}
          onChange={(e) => {
            const projectId = e.target.value;

            setSelectedProject(projectId);

            if (projectId) {
              localStorage.setItem("selectedProject", projectId);
            } else {
              localStorage.removeItem("selectedProject");
            }
          }}
        >
          <option value="">Select Project</option>

          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>

        {!selectedProject ? (
          <p className="empty-message">
            Please select a project to view tasks.
          </p>
        ) : loading ? (
          <p className="empty-message">Loading tasks...</p>
        ) : (
          <div className="kanban-board">
            {columns.map((status) => (
              <div
                className="kanban-column"
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => updateStatus(status)}
              >
                <div className="column-header">
                  <h2>{status}</h2>

                  <span>
                    {tasks.filter((task) => task.status === status).length}
                  </span>
                </div>

                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <div key={task._id}>
                      <div
                        className="task-card"
                        draggable={!statusLoading}
                        onDragStart={() => setDragTask(task._id)}
                        onClick={() =>
                          setSelectedTask(
                            selectedTask === task._id ? null : task._id,
                          )
                        }
                      >
                        <FaGripVertical />

                        <div>
                          <h3>{task.title}</h3>

                          <p>{task.assignedTo?.name || "Unassigned"}</p>

                          {canManage && (
                            <div className="task-actions">
                              <FaEdit
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditTask(task);
                                }}
                              />

                              <FaTrash
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTask(task._id);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedTask === task._id && (
                        <TaskComments taskId={task._id} />
                      )}
                    </div>
                  ))}

                {tasks.filter((task) => task.status === status).length ===
                  0 && <div className="empty-column">No tasks</div>}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <CreateTask
            close={() => setShowModal(false)}
            refresh={fetchTasks}
            projectId={selectedProject}
          />
        )}

        {editTask && (
          <EditTask
            task={editTask}
            close={() => setEditTask(null)}
            refresh={fetchTasks}
          />
        )}
      </main>
    </div>
  );
}

export default Tasks;
