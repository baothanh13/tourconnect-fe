import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import "./DashboardStyles.css";

const SupportDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedTickets: 0,
    totalUsers: 0,
    totalGuides: 0,
  });

  useEffect(() => {
    const loadSupportData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setStats({
            openTickets: 23,
            resolvedTickets: 145,
            totalUsers: 1547,
            totalGuides: 123,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading support data:", error);
        setLoading(false);
      }
    };

    loadSupportData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="support-dashboard">
      <div className="dashboard-header">
        <h1>Support Dashboard</h1>
        <p>Welcome back, {user?.name || "Support Agent"}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card urgent">
          <h3>Open Tickets</h3>
          <p className="stat-number">{stats.openTickets}</p>
        </div>
        <div className="stat-card success">
          <h3>Resolved Tickets</h3>
          <p className="stat-number">{stats.resolvedTickets}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Guides</h3>
          <p className="stat-number">{stats.totalGuides}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn urgent">View Open Tickets</button>
          <button className="action-btn">User Support</button>
          <button className="action-btn">Guide Support</button>
          <button className="action-btn">Generate Reports</button>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
