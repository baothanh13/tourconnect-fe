import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import SupportTicketManagement from "../components/dashboard/SupportTicketManagement";
import { supportService } from "../services/supportService";
// --- (1) IMPORT THE ICONS WE NEED ---
import {
  FaSignOutAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaUsers,
  FaHeadset,
  FaChartBar,
  FaExclamationCircle,
  FaClock,
  FaUserTie,
  FaHome,
  FaTasks,
  FaUserFriends,
} from "react-icons/fa";
import "./DashboardStyles.css"; // Your CSS file is correct

const SupportDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedTickets: 0,
    totalUsers: 0,
    totalGuides: 0,
    inProgressTickets: 0,
    totalTickets: 0,
  });

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const loadSupportData = async () => {
      try {
        setLoading(true);

        // Fetch support stats from backend
        const statsData = await supportService.getSupportStats();

        // Calculate additional metrics
        const totalTickets =
          statsData.open_tickets + statsData.resolved_tickets;

        setStats({
          openTickets: statsData.open_tickets || 0,
          resolvedTickets: statsData.resolved_tickets || 0,
          totalUsers: statsData.total_users || 0,
          totalGuides: statsData.total_guides || 0,
          inProgressTickets: Math.floor(totalTickets * 0.1), // Estimate in-progress tickets
          totalTickets: totalTickets,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading support data:", error);
        // Fallback to mock data if API fails
        setStats({
          openTickets: 23,
          resolvedTickets: 145,
          totalUsers: 1547,
          totalGuides: 123,
          inProgressTickets: 5,
          totalTickets: 168,
        });
        setLoading(false);
      }
    };
    loadSupportData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const ActionButton = ({ icon, label, className = "", onClick }) => (
    <button className={`action-btn ${className}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );

  const renderContent = () => {
    switch (activeView) {
      case "tickets":
        return <SupportTicketManagement />;
      default:
        return (
          <div className="dashboard-content-simple">
            {/* --- (2) UPDATED STAT CARD STRUCTURE --- */}
            <div className="stats-grid">
              <div className="stat-card urgent">
                <div className="card-icon">
                  <FaExclamationCircle />
                </div>
                <div className="card-info">
                  <p className="stat-value">{stats.openTickets}</p>
                  <h3 className="stat-title">Open Tickets</h3>
                </div>
              </div>
              <div className="stat-card warning">
                <div className="card-icon">
                  <FaClock />
                </div>
                <div className="card-info">
                  <p className="stat-value">{stats.inProgressTickets}</p>
                  <h3 className="stat-title">In Progress</h3>
                </div>
              </div>
              <div className="stat-card success">
                <div className="card-icon">
                  <FaCheckCircle />
                </div>
                <div className="card-info">
                  <p className="stat-value">{stats.resolvedTickets}</p>
                  <h3 className="stat-title">Resolved Tickets</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="card-icon">
                  <FaTicketAlt />
                </div>
                <div className="card-info">
                  <p className="stat-value">{stats.totalTickets}</p>
                  <h3 className="stat-title">Total Tickets</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="card-icon">
                  <FaUsers />
                </div>
                <div className="card-info">
                  <p className="stat-value">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <h3 className="stat-title">Total Users</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="card-icon">
                  <FaUserTie />
                </div>
                <div className="card-info">
                  <p className="stat-value">{stats.totalGuides}</p>
                  <h3 className="stat-title">Total Guides</h3>
                </div>
              </div>
            </div>

            {/* --- (3) UPDATED QUICK ACTIONS STRUCTURE --- */}
            <div className="quick-actions-container">
              <h2>Quick Actions</h2>
              <div className="action-buttons-grid">
                <ActionButton
                  icon={<FaTasks />}
                  label="Manage Tickets"
                  onClick={() => setActiveView("tickets")}
                />
                <ActionButton
                  icon={<FaExclamationCircle />}
                  label="Urgent Tickets"
                  onClick={() => setActiveView("tickets")}
                  className="urgent"
                />
                <ActionButton
                  icon={<FaUserFriends />}
                  label="User Support"
                  onClick={() => setActiveView("tickets")}
                />
                <ActionButton
                  icon={<FaChartBar />}
                  label="Reports & Analytics"
                />
                <ActionButton icon={<FaUsers />} label="User Management" />
                <ActionButton icon={<FaHeadset />} label="Live Chat Support" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header with navigation */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Support Dashboard</h1>
          <p>Welcome back, {user?.name || "Support Agent"}!</p>
        </div>
        <div className="header-nav">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`nav-btn ${activeView === "dashboard" ? "active" : ""}`}
          >
            <FaHome />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("tickets")}
            className={`nav-btn ${activeView === "tickets" ? "active" : ""}`}
          >
            <FaTicketAlt />
            Support Tickets
          </button>
        </div>
        <button onClick={handleLogout} className="logout-btn-simple">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Dashboard content */}
      {renderContent()}
    </div>
  );
};

export default SupportDashboard;
