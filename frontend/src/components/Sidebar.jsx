import { NavLink } from "react-router-dom";

import { FaHome, FaFolder, FaTasks, FaUser } from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">TeamSync</div>

      <nav>
        <NavLink to="/dashboard">
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/projects">
          <FaFolder />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/tasks">
          <FaTasks />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/profile">
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
