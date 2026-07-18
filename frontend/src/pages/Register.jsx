import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import "../styles/Auth.css";

function Register() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Team Member",
  });

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);

      toast.success("Account created");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        <p>Join project management system</p>

        <div className="input-box">
          <FaUser />

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="input-box">
          <FaEnvelope />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-box">
          <FaLock />

          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <span
            className="password-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <select name="role" value={form.role} onChange={handleChange}>
          <option>Admin</option>

          <option>Project Manager</option>

          <option>Team Member</option>
        </select>

        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
