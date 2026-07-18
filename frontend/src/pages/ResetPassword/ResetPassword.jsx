import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import axiosInstance from "../../utils/axiosInstance";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (data.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axiosInstance.put(
        `/auth/reset-password/${token}`,
        {
          password: data.password,
        },
      );

      toast.success(response.data.message);

      localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <form className="reset-form" onSubmit={submitHandler}>
        <h2>Reset Password</h2>

        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            name="password"
            value={data.password}
            onChange={changeHandler}
          />

          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
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

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <Loader /> : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
