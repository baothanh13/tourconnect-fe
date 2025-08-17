import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
// --- (1) IMPORT THE ICONS WE NEED ---
import {
  FaSignOutAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaUsers,
  FaUserShield,
  FaHeadset,
  FaChartBar,
} from "react-icons/fa";
import "./DashboardStyles.css"; // Your CSS file is correct

const SupportDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openTickets: 23,
    resolvedTickets: 145,
    totalUsers: 1547,
    totalGuides: 123,
  });

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    // Your data loading logic is fine, no changes needed here
    const loadSupportData = async () => {
      try {
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
    <div className="dashboard-page">
      {/* Your new header component is great, no changes needed */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Support Dashboard</h1>
          <p>Welcome back, {user?.name || "Support"}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-simple">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="dashboard-content-simple">
        {/* --- (2) UPDATED STAT CARD STRUCTURE --- */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="card-icon pending">
              {" "}
              {/* Use pending color */}
              <FaTicketAlt />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.openTickets}</p>
              <h3 className="stat-title">Open Tickets</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon revenue">
              {" "}
              {/* Use success color */}
              <FaCheckCircle />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.resolvedTickets}</p>
              <h3 className="stat-title">Resolved Tickets</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaUsers />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
              <h3 className="stat-title">Total Users</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaUserShield />
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
            <button className="action-btn warning">
              {" "}
              {/* Use warning/danger color */}
              <FaTicketAlt />
              <span>View Open Tickets</span>
            </button>
            <button className="action-btn">
              <FaHeadset />
              <span>User Support</span>
            </button>
            <button className="action-btn">
              <FaUserShield />
              <span>Guide Support</span>
            </button>
            <button className="action-btn">
              <FaChartBar />
              <span>Generate Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
