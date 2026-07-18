import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import axiosInstance from "../../utils/axiosInstance";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return toast.error("Enter a valid email");
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });

      toast.success(response.data.message);

      if (response.data.resetToken) {
        toast.info(`Reset Token : ${response.data.resetToken}`, {
          autoClose: 10000,
        });
      }

      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <form className="forgot-form" onSubmit={submitHandler}>
        <h2>Forgot Password</h2>

        <p>Enter your registered email address.</p>

        <div className="input-box">
          <MdOutlineEmail />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <Loader /> : "Send Reset Link"}
        </button>

        <Link to="/login" className="back-link">
          Back to Login
        </Link>
      </form>
    </div>
  );
}

export default ForgotPassword;
