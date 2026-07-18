import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import api from "../services/api";

import {
  FaProjectDiagram,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { toast } from "react-toastify";

import "../styles/Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState([]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get("/dashboard/stats");

      setStats(statsRes.data.stats);

      const chartRes = await api.get("/dashboard/chart");

      const data = chartRes.data.chart.labels.map((label, index) => ({
        name: label,

        value: chartRes.data.chart.values[index],
      }));

      setChart(data);
      setLoading(false);
    } catch (error) {
      toast.error("Unable to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <Navbar />

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>

          <p>Overview of your project management activity</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Projects"
            value={stats.projects}
            icon={<FaProjectDiagram />}
            type="primary"
          />

          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={<FaCheckCircle />}
            type="success"
          />

          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={<FaClock />}
            type="warning"
          />

          <StatCard
            title="Overdue"
            value={stats.overdueTasks}
            icon={<FaExclamationTriangle />}
            type="danger"
          />
        </div>

        <div className="dashboard-panels">
          <div className="panel chart-panel">
            <h2>Task Status</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chart}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
