import "../styles/Dashboard.css";

function StatCard({ title, value, icon, type }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-icon">{icon}</div>

      <div>
        <h3>{value}</h3>

        <p>{title}</p>
      </div>
    </div>
  );
}

export default StatCard;
