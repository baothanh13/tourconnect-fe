import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import "./DashboardStyles.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGuides: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setStats({
            totalUsers: 1547,
            totalGuides: 123,
            totalBookings: 2890,
            totalRevenue: 45600,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading admin data:", error);
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name || "Administrator"}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Guides</h3>
          <p className="stat-number">{stats.totalGuides.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.totalBookings.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn">Manage Users</button>
          <button className="action-btn">Manage Guides</button>
          <button className="action-btn">View Reports</button>
          <button className="action-btn">System Settings</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
