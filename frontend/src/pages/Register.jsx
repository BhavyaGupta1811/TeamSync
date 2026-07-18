import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Team Member",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return toast.error("Please fill in all fields.");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      });

      toast.success("Account created successfully");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        <p>Join the project management system</p>

        <div className="input-box">
          <FaUser />

          <input
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <FaEnvelope />

          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <FaLock />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="password-eye"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Admin">Admin</option>

          <option value="Project Manager">Project Manager</option>

          <option value="Team Member">Team Member</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
