import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { guideDashboardService } from "../services/guideDashboardService";
import { guidesService } from "../services/guidesService";
import {
  FaSignOutAlt,
  FaRoute,
  FaCalendarCheck,
  FaCalendarAlt,
  FaDollarSign,
  FaStar,
  FaComments,
  FaExclamationTriangle,
  FaClock,
  FaPlus,
  FaEye,
  FaEdit,
  FaChartLine,
} from "react-icons/fa";
import "./DashboardStyles.css";

const GuideDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guideProfile, setGuideProfile] = useState(null);
  const [stats, setStats] = useState({
    totalTours: 0,
    completedTours: 0,
    upcomingTours: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalReviews: 0,
    verificationStatus: "pending",
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const loadGuideData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get guide profile by user ID
        const profile = await guidesService.getGuideByUserId(user.id);
        setGuideProfile(profile);

        if (profile && profile.id) {
          // Use the guide ID to fetch dashboard data
          const dashboardData =
            await guideDashboardService.getGuideDashboardData(
              user.id,
              profile.id
            );

          setStats(dashboardData.stats);

          // Fetch additional data
          const [activities, upcoming] = await Promise.all([
            guideDashboardService.getRecentActivities(profile.id, 5),
            guideDashboardService.getUpcomingBookings(profile.id, 5),
          ]);

          setRecentActivities(activities);
          setUpcomingBookings(upcoming);
        } else {
          // Guide profile doesn't exist yet - redirect to profile creation
          navigate("/guide/profile/create");
        }
      } catch (error) {
        console.error("Error loading guide data:", error);
        setError(error.message);

        // Fallback to mock data if API fails
        setStats({
          totalTours: 0,
          completedTours: 0,
          upcomingTours: 0,
          pendingBookings: 0,
          totalEarnings: 0,
          averageRating: 0,
          totalReviews: 0,
          verificationStatus: "pending",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      loadGuideData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "rejected":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Guide Dashboard</h1>
          <p>Welcome back, {user?.name || guideProfile?.name || "Guide"}!</p>
          {guideProfile && (
            <div className="verification-status">
              <span
                className={`status-badge ${getVerificationStatusColor(
                  stats.verificationStatus
                )}`}
              >
                {stats.verificationStatus.charAt(0).toUpperCase() +
                  stats.verificationStatus.slice(1)}
              </span>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn-simple">
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content-simple">
        {error && (
          <div className="error-banner">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="card-icon">
              <FaRoute />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.totalTours}</p>
              <h3 className="stat-title">Total Tours</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaCalendarCheck />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.completedTours}</p>
              <h3 className="stat-title">Completed Tours</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaCalendarAlt />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.upcomingTours}</p>
              <h3 className="stat-title">Upcoming Tours</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaClock />
            </div>
            <div className="card-info">
              <p className="stat-value">{stats.pendingBookings}</p>
              <h3 className="stat-title">Pending Bookings</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaDollarSign />
            </div>
            <div className="card-info">
              <p className="stat-value">
                ${stats.totalEarnings.toLocaleString()}
              </p>
              <h3 className="stat-title">Total Earnings</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="card-icon">
              <FaStar />
            </div>
            <div className="card-info">
              <p className="stat-value">⭐ {stats.averageRating}</p>
              <h3 className="stat-title">Average Rating</h3>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-container">
          <h2>Quick Actions</h2>
          <div className="action-buttons-grid">
            <button
              className="action-btn"
              onClick={() => navigate("/guide/tours")}
            >
              <FaRoute />
              <span>Manage Tours</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/guide/bookings")}
            >
              <FaCalendarAlt />
              <span>View Bookings</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/guide/earnings")}
            >
              <FaChartLine />
              <span>Check Earnings</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/guide/profile")}
            >
              <FaEdit />
              <span>Update Profile</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/guide/tours/new")}
            >
              <FaPlus />
              <span>Create Tour</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/guide/reviews")}
            >
              <FaComments />
              <span>View Reviews</span>
            </button>
          </div>
        </div>

        {/* Two Column Layout for Activities and Bookings */}
        <div className="dashboard-grid">
          {/* Recent Activities */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Recent Activities</h3>
              <button
                className="view-all-btn"
                onClick={() => navigate("/guide/activities")}
              >
                View All
              </button>
            </div>
            <div className="activities-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === "booking" && <FaCalendarAlt />}
                      {activity.type === "review" && <FaStar />}
                      {activity.type === "payment" && <FaDollarSign />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <p className="activity-description">
                        {activity.description}
                      </p>
                      <span className="activity-time">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                    <div className={`activity-status ${activity.status}`}>
                      {activity.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Bookings */}
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Upcoming Bookings</h3>
              <button
                className="view-all-btn"
                onClick={() => navigate("/guide/bookings")}
              >
                View All
              </button>
            </div>
            <div className="bookings-list">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-date">
                      <span className="date">{formatDate(booking.date)}</span>
                      <span className="time">
                        {formatTime(booking.time_slot)}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p className="tourist-name">
                        {booking.tourist_name || "Tourist"}
                      </p>
                      <p className="booking-info">
                        {booking.number_of_tourists}{" "}
                        {booking.number_of_tourists === 1 ? "person" : "people"}{" "}
                        • ${booking.total_price}
                      </p>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="btn-small btn-view"
                        onClick={() =>
                          navigate(`/guide/bookings/${booking.id}`)
                        }
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
