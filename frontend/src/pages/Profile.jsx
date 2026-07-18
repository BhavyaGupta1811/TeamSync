import { useEffect, useState } from "react";

import { FaUser, FaEnvelope, FaLock, FaSave } from "react-icons/fa";

import api from "../services/api";

import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Profile.css";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await api.get("/auth/profile");

        if (!mounted) return;

        setProfile({
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          password: "",
        });
      } catch (error) {
        if (mounted) {
          toast.error(
            error.response?.data?.message || "Unable to load profile",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateProfile = async () => {
    if (!profile.name.trim()) {
      return toast.error("Name is required.");
    }

    if (profile.password && profile.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      setSaving(true);

      const payload = {
        name: profile.name.trim(),
      };

      if (profile.password.trim()) {
        payload.password = profile.password.trim();
      }

      await api.put("/profile/update", payload);

      toast.success("Profile updated successfully.");

      setProfile((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <Navbar />

        <main className="page-content">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

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
                required
              />
            </div>

            <div className="profile-input">
              <FaEnvelope />

              <input type="email" name="email" value={profile.email} disabled />
            </div>

            <div className="profile-input">
              <FaUser />

              <input type="text" value={profile.role} disabled />
            </div>

            <div className="profile-input">
              <FaLock />

              <input
                type="password"
                name="password"
                placeholder="Change password (optional)"
                value={profile.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button
              className="save-btn"
              onClick={updateProfile}
              disabled={saving}
            >
              <FaSave />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
