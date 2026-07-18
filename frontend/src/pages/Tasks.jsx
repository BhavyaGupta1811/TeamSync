import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { FaPlus, FaGripVertical } from "react-icons/fa";
import EditTask from "../components/EditTask";
import { FaEdit, FaTrash } from "react-icons/fa";
import CreateTask from "../components/CreateTask";
import TaskComments from "../components/TaskComments";

import api from "../services/api";

import { toast } from "react-toastify";

import "../styles/Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(
    localStorage.getItem("selectedProject") || "",
  );
  const [selectedTask, setSelectedTask] = useState(null);

  const [dragTask, setDragTask] = useState(null);

  const fetchTasks = async () => {
    if (!selectedProject) {
      setTasks([]);
      return;
    }

    try {
      const res = await api.get(`/tasks/project/${selectedProject}`);

      setTasks(res.data.tasks);
    } catch (error) {
      toast.error("Unable to load tasks");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);
  const updateStatus = async (status) => {
    if (!dragTask) return;

    try {
      await api.patch(`/tasks/${dragTask}/status`, {
        status,
      });

      toast.success("Task updated");

      setDragTask(null);

      fetchTasks();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      toast.success("Task deleted");

      fetchTasks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const columns = ["Todo", "In Progress", "Completed"];

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");

      setProjects(res.data.projects);

      const savedProject = localStorage.getItem("selectedProject");

      const exists = res.data.projects.some(
        (project) => project._id === savedProject,
      );

      if (!exists) {
        localStorage.removeItem("selectedProject");

        setSelectedProject("");
      }
    } catch (error) {
      toast.error("Unable to load projects");
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

          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <FaPlus />
            Add Task
          </button>
        </div>

        <select
          className="project-select"
          value={selectedProject}
          onChange={(e) => {
            const projectId = e.target.value;

            setSelectedProject(projectId);

            localStorage.setItem("selectedProject", projectId);
          }}
        >
          <option value="">Select Project</option>

          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.title}
            </option>
          ))}
        </select>

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
                      draggable
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
                      </div>
                    </div>

                    {selectedTask === task._id && (
                      <TaskComments taskId={task._id} />
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>

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
