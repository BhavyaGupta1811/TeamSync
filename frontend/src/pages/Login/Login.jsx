import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import axiosInstance from "../../utils/axiosInstance";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/auth/login", data);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(response.data.message);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={submitHandler}>
        <h2>Welcome Back</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? <Loader /> : "Login"}
        </button>

        <p>
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>

        <Link to="/forgot-password" className="forgot-link">
          Forgot Password?
        </Link>
      </form>
    </div>
  );
}

export default Login;
