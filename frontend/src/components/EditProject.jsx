import { useCallback, useEffect, useRef, useState } from "react";
import { FaAngleDown, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "../services/api";

import "../styles/Modal.css";

function EditProject({ project, close, refresh }) {
  const [users, setUsers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    teamMembers: [],
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/users");

      setUsers(
        (res.data.users || []).filter((user) => user.role === "Team Member"),
      );
    } catch (error) {
      toast.error("Unable to load team members.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!project) return;

    setForm({
      title: project.title || "",
      description: project.description || "",
      startDate: project.startDate?.slice(0, 10) || "",
      endDate: project.endDate?.slice(0, 10) || "",
      teamMembers:
        project.teamMembers?.map((member) =>
          typeof member === "object" ? member._id : member,
        ) || [],
    });
  }, [project]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMembers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMember = (id) => {
    setForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(id)
        ? prev.teamMembers.filter((member) => member !== id)
        : [...prev.teamMembers, id],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.startDate ||
      !form.endDate
    ) {
      return toast.error("Please fill all required fields.");
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      return toast.error("End date cannot be before start date.");
    }

    try {
      setLoading(true);

      await api.put(`/projects/${project._id}`, form);

      toast.success("Project updated successfully.");

      setShowMembers(false);

      refresh();
      close();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update project.",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedMembers = users
    .filter((user) => form.teamMembers.includes(user._id))
    .map((user) => user.name);

  const selectedText =
    selectedMembers.length === 0
      ? "Select Team Members"
      : selectedMembers.length <= 2
        ? selectedMembers.join(", ")
        : `${selectedMembers.slice(0, 2).join(", ")} +${
            selectedMembers.length - 2
          }`;

  return (
    <div className="modal-overlay">
      <form className="modal-box" onSubmit={submit}>
        <div className="modal-head">
          <h2>Edit Project</h2>

          <FaTimes className="close-icon" onClick={close} />
        </div>

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="date-group">
          <div>
            <label>Start Date</label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>End Date</label>

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label className="select-label">Team Members</label>

        <div className="custom-select" ref={dropdownRef}>
          <button
            type="button"
            className="select-header"
            onClick={() => setShowMembers((prev) => !prev)}
          >
            <span>{selectedText}</span>

            <span className={`arrow ${showMembers ? "rotate" : ""}`}>
              <FaAngleDown />
            </span>
          </button>

          {showMembers && (
            <div className="select-dropdown">
              {users.length ? (
                users.map((user) => (
                  <label key={user._id} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={form.teamMembers.includes(user._id)}
                      onChange={() => toggleMember(user._id)}
                    />

                    <span>{user.name}</span>
                  </label>
                ))
              ) : (
                <div className="checkbox-item">No Team Members Found</div>
              )}
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
}

export default EditProject;
