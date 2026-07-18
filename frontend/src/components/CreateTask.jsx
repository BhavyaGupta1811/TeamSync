import { useEffect, useState } from "react";

import { FaTimes } from "react-icons/fa";

import api from "../services/api";

import { toast } from "react-toastify";

import "../styles/Modal.css";

function CreateTask({ close, refresh, projectId }) {
  const [users, setUsers] = useState([]);

  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: projectId,
    assignedTo: "",
    dueDate: "",
    status: "Todo",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      setUsers(res.data.users);
    } catch (error) {
      toast.error("Unable to load users");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");

      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Unable to load projects");
    }
  };

  useEffect(() => {
    fetchUsers();

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", form);

      toast.success("Task created");

      refresh();

      close();
    } catch (error) {
      toast.error(error.response?.data?.message || "Task creation failed");
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={submit}>
        <div className="modal-head">
          <h2>Create Task</h2>

          <FaTimes onClick={close} />
        </div>

        <input
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

        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          required
        >
          <option value="">Select Member</option>

          {users
            .filter((user) => user.role === "Team Member")
            .map((user) => (
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
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Todo">Todo</option>

          <option value="In Progress">In Progress</option>

          <option value="Completed">Completed</option>
        </select>

        <button>Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;
