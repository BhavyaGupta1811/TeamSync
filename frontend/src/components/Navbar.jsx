import { useState, useEffect, useRef } from "react";

import { FaBell, FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  const [search, setSearch] = useState("");

  const [results, setResults] = useState({
    projects: [],
    tasks: [],
    users: [],
  });

  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (search.trim().length === 0) {
        setResults({
          projects: [],
          tasks: [],
          users: [],
        });

        return;
      }

      try {
        const res = await api.get(`/search?query=${search}`);

        setResults(res.data.result);

        setShowResults(true);
      } catch (error) {
        console.log(error);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");

        setNotifications(res.data.notifications);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  // close dropdown outside click

  useEffect(() => {
    const handleClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="search-container" ref={searchRef}>
        <div className="search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search projects, tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
        </div>

        {showResults && search && (
          <div className="search-dropdown">
            {results.projects?.length > 0 && (
              <>
                <h4>Projects</h4>

                {results.projects.map((project) => (
                  <div className="search-item" key={project._id}>
                    📁 {project.title}
                  </div>
                ))}
              </>
            )}

            {results.tasks?.length > 0 && (
              <>
                <h4>Tasks</h4>

                {results.tasks.map((task) => (
                  <div className="search-item" key={task._id}>
                    ✅ {task.title}
                  </div>
                ))}
              </>
            )}

            {results.users?.length > 0 && (
              <>
                <h4>Users</h4>

                {results.users.map((user) => (
                  <div className="search-item" key={user._id}>
                    👤 {user.name}
                  </div>
                ))}
              </>
            )}

            {!results.projects?.length &&
              !results.tasks?.length &&
              !results.users?.length && (
                <p className="no-result">No results found</p>
              )}
          </div>
        )}
      </div>

      <div className="nav-actions">
        <div className="notification-box">
          <button
            className="icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />

            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="badge">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div className="notification-item" key={notification._id}>
                    <FaBell/> {notification.message}
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          )}
        </div>

        <div className="profile-btn" onClick={() => navigate("/profile")}>
          <FaUserCircle />

          <span>{user?.name || "Admin"}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
