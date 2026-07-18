import { useState } from "react";

import {
  FaProjectDiagram,
  FaTasks,
  FaUsers,
  FaChartLine,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "../styles/Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="home-logo">TeamSync</div>

        <div className={`home-nav-links ${menuOpen ? "active" : ""}`}>
          <a href="/home">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </nav>

      <main className="home-content">
        <section className="hero">
          <h1>Manage Projects, Tasks & Teams Smarter</h1>

          <p>
            TeamSync is a modern project management platform designed to help
            teams plan projects, organize tasks, track progress and collaborate
            efficiently. From creating projects and assigning responsibilities
            to monitoring productivity through analytics, everything your team
            needs is available in one simple dashboard.
          </p>
          <br/>
          <p>
            Whether you are managing a small team or handling multiple projects,
            TeamSync helps you stay organized, improve communication and deliver
            work faster with complete visibility.
          </p>

          <div className="hero-actions">
            <button>Get Started</button>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <FaProjectDiagram />
            <h3>Project Management</h3>
            <p>Create, organize and track multiple projects easily.</p>
          </div>

          <div className="feature-card">
            <FaTasks />
            <h3>Task Tracking</h3>
            <p>Assign tasks, update status and manage workflow.</p>
          </div>

          <div className="feature-card">
            <FaUsers />
            <h3>Team Collaboration</h3>
            <p>Work together with comments and task discussions.</p>
          </div>

          <div className="feature-card">
            <FaChartLine />
            <h3>Analytics Dashboard</h3>
            <p>View project statistics and performance reports.</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <h3>TeamSync</h3>

          <p>Manage projects, tasks and teams efficiently.</p>
        </div>

        <div>
          <h4>Links</h4>

          <a href="/login">Login</a>

          <a href="/register">Register</a>
        </div>

        <div>
          <h4>Contact</h4>

          <p>support@TeamSync.com</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
