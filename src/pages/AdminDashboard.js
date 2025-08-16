import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import {
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaDollarSign,
  FaUserClock,
  FaTasks,
  FaUserCog,
  FaUserCheck,
  FaListAlt,
  FaChartBar,
  FaExclamationTriangle,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import "./DashboardStyles.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGuides: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingGuides: 0,
    activeBookings: 0,
  });

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setTimeout(() => {
          setStats({
            totalUsers: 2547,
            totalGuides: 234,
            totalBookings: 1823,
            totalRevenue: 125780,
            pendingGuides: 12,
            activeBookings: 89,
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

  const StatCard = ({ icon, title, value, className = "" }) => (
    <div className={`stat-card ${className}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-info">
        <p className="stat-value">{value}</p>
        <h3 className="stat-title">{title}</h3>
      </div>
    </div>
  );

  const ActionButton = ({ icon, label, className = "" }) => (
    <button className={`action-btn ${className}`}>
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="dashboard-page">
      {/* Simple header with logout */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || "Admin"}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-simple">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content-simple">
        <div className="stats-grid">
          <StatCard
            icon={<FaUsers />}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
          />
          <StatCard
            icon={<FaUserTie />}
            title="Total Guides"
            value={stats.totalGuides}
          />
          <StatCard
            icon={<FaCalendarCheck />}
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
          />
          <StatCard
            icon={<FaDollarSign />}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            className="revenue"
          />
          <StatCard
            icon={<FaUserClock />}
            title="Pending Guides"
            value={stats.pendingGuides}
            className="pending"
          />
          <StatCard
            icon={<FaTasks />}
            title="Active Bookings"
            value={stats.activeBookings}
          />
        </div>

        <div className="quick-actions-container">
          <h2>Quick Actions</h2>
          <div className="action-buttons-grid">
            <ActionButton icon={<FaUserCog />} label="Manage Users" />
            <ActionButton icon={<FaUserCheck />} label="Approve Guides" />
            <ActionButton icon={<FaListAlt />} label="View Bookings" />
            <ActionButton icon={<FaChartBar />} label="Generate Reports" />
            <ActionButton
              icon={<FaExclamationTriangle />}
              label="Review Complaints"
              className="warning"
            />
            <ActionButton icon={<FaCogs />} label="System Settings" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
