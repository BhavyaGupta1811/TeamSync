import { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";

import "../styles/Modal.css";

function CreateTask({ close, refresh, projectId }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: projectId || "",
    assignedTo: "",
    dueDate: "",
    status: "Todo",
  });

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (error) {
      toast.error("Unable to load users");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.projects || []);
    } catch (error) {
      toast.error("Unable to load projects");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "project") {
      setForm((prev) => ({
        ...prev,
        project: value,
        assignedTo: "",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const availableMembers = useMemo(() => {
    if (!form.project) return [];

    const selectedProject = projects.find(
      (project) => project._id === form.project,
    );

    if (!selectedProject) return [];

    return users.filter(
      (user) =>
        user.role === "Team Member" &&
        selectedProject.teamMembers?.some(
          (member) =>
            (typeof member === "object" ? member._id : member) === user._id,
        ),
    );
  }, [projects, users, form.project]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/tasks", form);

      toast.success("Task created successfully");

      refresh();
      close();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={submit}>
        <div className="modal-head">
          <h2>Create Task</h2>

          <FaTimes className="close-icon" onClick={close} />
        </div>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task description"
          value={form.description}
          onChange={handleChange}
          required
        />

        {!projectId && (
          <select
            name="project"
            value={form.project}
            onChange={handleChange}
            required
          >
            <option value="">Select Project</option>

            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        )}

        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          required
          disabled={!form.project}
        >
          <option value="">
            {form.project ? "Select Team Member" : "Select Project First"}
          </option>

          {availableMembers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          required
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
