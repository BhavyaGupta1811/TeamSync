import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active-link" : "";
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            TaskFlow
          </Link>
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <button className="close-btn" onClick={closeMenu}>
            <IoClose />
          </button>

          <li>
            <Link to="/" className={isActive("/")} onClick={closeMenu}>
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/login"
              className={isActive("/login")}
              onClick={closeMenu}
            >
              Login
            </Link>
          </li>

          <li>
            <Link
              to="/register"
              className={isActive("/register")}
              onClick={closeMenu}
            >
              Register
            </Link>
          </li>

          <li>
            <Link
              to="/forgot-password"
              className={isActive("/forgot-password")}
              onClick={closeMenu}
            >
              Forgot Password
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard"
              className={isActive("/dashboard")}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          </li>

          <div className="mobile-buttons">
            <Link to="/login" onClick={closeMenu}>
              <button className="login-btn">Login</button>
            </Link>

            <Link to="/register" onClick={closeMenu}>
              <button className="signup-btn">Register</button>
            </Link>
          </div>
        </ul>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="signup-btn">Register</button>
          </Link>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          <GiHamburgerMenu />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
