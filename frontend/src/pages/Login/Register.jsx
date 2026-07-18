import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import axiosInstance from "../../utils/axiosInstance";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const getStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 1) {
      return {
        text: "Weak",
        className: "weak",
        width: "33%",
      };
    }

    if (score === 2 || score === 3) {
      return {
        text: "Medium",
        className: "medium",
        width: "66%",
      };
    }

    return {
      text: "Strong",
      className: "strong",
      width: "100%",
    };
  };

  const strength = getStrength(data.password);

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!data.name.trim()) {
      return toast.error("Name is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      return toast.error("Enter a valid email");
    }

    if (data.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(response.data.message);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={submitHandler}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={data.name}
          onChange={changeHandler}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={data.email}
          onChange={changeHandler}
        />

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={changeHandler}
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="strength">
          <div
            className={`strength-fill ${strength.className}`}
            style={{
              width: strength.width,
            }}
          ></div>
        </div>

        <p className={`strength-text ${strength.className}`}>{strength.text}</p>

        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={changeHandler}
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <Loader /> : "Register"}
        </button>

        <p>
          Already have an account?
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
