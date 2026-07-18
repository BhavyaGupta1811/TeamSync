import { useEffect, useState } from "react";

import { FaUser, FaEnvelope, FaLock, FaSave } from "react-icons/fa";

import api from "../services/api";

import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");

      setProfile({
        name: res.data.user.name,

        email: res.data.user.email,

        role: res.data.user.role,

        password: "",
      });
    } catch (error) {
      toast.error("Unable to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,

      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      await api.put(
        "/profile/update",

        profile,
      );

      toast.success("Profile updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };
  return (
    <div className="page-layout">
      <Sidebar />

      <Navbar />

      <main className="page-content">
        <div className="page-header">
          <div>
            <h1>Profile</h1>

            <p>Manage your account settings</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">
            <FaUser />
          </div>

          <div className="profile-form">
            <div className="profile-input">
              <FaUser />

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="profile-input">
              <FaEnvelope />

              <input type="email" name="email" value={profile.email} disabled />
            </div>

            <div className="profile-input">
              <FaUser />

              <input value={profile.role} disabled />
            </div>

            <div className="profile-input">
              <FaLock />

              <input
                type="password"
                name="password"
                placeholder="Change password"
                value={profile.password}
                onChange={handleChange}
              />
            </div>

            <button className="save-btn" onClick={updateProfile}>
              <FaSave />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
