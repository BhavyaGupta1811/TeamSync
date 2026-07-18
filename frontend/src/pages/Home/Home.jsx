import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-left">
            <h1>
              Manage Projects.
              <br />
              Track Progress.
              <br />
              Deliver Faster.
            </h1>

            <p>
              A premium project management system that helps teams collaborate,
              organize tasks and monitor project progress effortlessly.
            </p>

            <div className="hero-buttons">
              <button>Start Managing</button>

              <button className="outline">Explore</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="dashboard-card">
              <div className="stat">
                <h2>8</h2>
                <p>Projects</p>
              </div>

              <div className="stat">
                <h2>65</h2>
                <p>Completed</p>
              </div>

              <div className="stat">
                <h2>20</h2>
                <p>Pending</p>
              </div>

              <div className="stat">
                <h2>4</h2>
                <p>Overdue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose TaskFlow?</h2>

          <div className="feature-grid">
            <div className="feature-card">
              <h3>Project Management</h3>
              <p>Create and organize unlimited projects.</p>
            </div>

            <div className="feature-card">
              <h3>Task Tracking</h3>
              <p>Assign, update and monitor task progress.</p>
            </div>

            <div className="feature-card">
              <h3>Team Collaboration</h3>
              <p>Work together with comments and updates.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
