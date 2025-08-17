import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { FaSignOutAlt } from "react-icons/fa";
import "./DashboardStyles.css";

const GuideDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTours: 0,
    completedTours: 0,
    upcomingTours: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
  });

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const loadGuideData = async () => {
      try {
        setTimeout(() => {
          setStats({
            totalTours: 87,
            completedTours: 72,
            upcomingTours: 15,
            totalEarnings: 12450,
            averageRating: 4.8,
            totalReviews: 156,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading guide data:", error);
        setLoading(false);
      }
    };

    loadGuideData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-page">
      {/* Simple header with logout */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Guide Dashboard</h1>
          <p>Welcome back, {user?.name || "Guide"}!</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-simple">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content-simple">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tours</h3>
            <p className="stat-number">{stats.totalTours}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Tours</h3>
            <p className="stat-number">{stats.completedTours}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Tours</h3>
            <p className="stat-number">{stats.upcomingTours}</p>
          </div>
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="stat-number">
              ${stats.totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="stat-card">
            <h3>Average Rating</h3>
            <p className="stat-number">⭐ {stats.averageRating}</p>
          </div>
          <div className="stat-card">
            <h3>Total Reviews</h3>
            <p className="stat-number">{stats.totalReviews}</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Manage Tours</button>
            <button className="action-btn">View Bookings</button>
            <button className="action-btn">Check Earnings</button>
            <button className="action-btn">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
