import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { FaSignOutAlt } from "react-icons/fa";
import "./DashboardStyles.css";

const TouristDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedTours: 0,
    upcomingTours: 0,
    totalSpent: 0,
    favoriteGuides: 0,
    savedWishlist: 0,
  });

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const loadTouristData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setStats({
            totalBookings: 8,
            completedTours: 5,
            upcomingTours: 3,
            totalSpent: 2450,
            favoriteGuides: 4,
            savedWishlist: 12,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading tourist data:", error);
        setLoading(false);
      }
    };

    loadTouristData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-page">
      {/* Simple header with logout */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Tourist Dashboard</h1>
          <p>
            Welcome back, {user?.name || "Traveler"}! Ready for your next
            adventure?
          </p>
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
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats.totalBookings}</p>
          </div>
          <div className="stat-card success">
            <h3>Completed Tours</h3>
            <p className="stat-number">{stats.completedTours}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Tours</h3>
            <p className="stat-number">{stats.upcomingTours}</p>
          </div>
          <div className="stat-card">
            <h3>Total Spent</h3>
            <p className="stat-number">${stats.totalSpent.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Favorite Guides</h3>
            <p className="stat-number">{stats.favoriteGuides}</p>
          </div>
          <div className="stat-card">
            <h3>Wishlist Items</h3>
            <p className="stat-number">{stats.savedWishlist}</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Browse Tours</button>
            <button className="action-btn">My Bookings</button>
            <button className="action-btn">Favorite Guides</button>
            <button className="action-btn">Wishlist</button>
            <button className="action-btn">Profile Settings</button>
            <button className="action-btn">Leave Review</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
