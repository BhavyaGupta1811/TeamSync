import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";

import "../styles/Modal.css";

function EditTask({ task, close, refresh }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assignedTo: task?.assignedTo?._id || "",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/tasks/${task._id}`, form);

      toast.success("Task updated successfully.");

      refresh();
      close();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={submit}>
        <div className="modal-head">
          <h2>Edit Task</h2>

          <FaTimes className="close-icon" onClick={close} />
        </div>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">
          Update Task
        </button>
      </form>
    </div>
  );
}

export default EditTask;
