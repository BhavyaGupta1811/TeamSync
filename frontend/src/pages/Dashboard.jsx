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

  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [statsRes, chartRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/chart"),
        ]);

        if (!mounted) return;

        setStats(statsRes.data.stats);

        const chartData = chartRes.data.chart.labels.map((label, index) => ({
          name: label,
          value: chartRes.data.chart.values[index],
        }));

        setChart(chartData);
      } catch (error) {
        if (mounted) {
          toast.error(
            error.response?.data?.message || "Unable to load dashboard",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      mounted = false;
    };
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

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
