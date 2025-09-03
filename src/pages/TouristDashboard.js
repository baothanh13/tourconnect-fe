import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import touristService from "../services/touristService";
import {
  FaSignOutAlt,
  FaHome,
  FaCalendarCheck,
  FaStar,
  FaDollarSign,
  FaRoute,
  FaClock,
  FaComments,
  FaSearch,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaHeadset,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import "./DashboardStyles.css";
import "./ModernDashboard.css";
import "./TouristDashboard.css";

const TouristDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [error, setError] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedTours: 0,
    totalSpent: 0,
    favoriteGuides: 0,
    savedWishlist: 0,
    averageRating: 0,
    totalReviews: 0,
    membershipsLevel: "Explorer",
    rewardPoints: 0,
    monthlySpent: 0,
    growthPercentage: 0,
  });

  // Profile (từ /tourist/me)
  const [profile, setProfile] = useState(null);

  // Form update profile
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [updating, setUpdating] = useState(false);

  // Modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveView(tab);
  }, [searchParams]);

  useEffect(() => {
    const loadTouristData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load stats
        const fetchTouristStats = async () => {
          try {
            const statsData = await touristService.getTouristStats(user.id);
            setStats(
              statsData || {
                totalBookings: 0,
                completedTours: 0,
                totalSpent: 0,
                favoriteGuides: 0,
                savedWishlist: 0,
                averageRating: 0,
                totalReviews: 0,
                membershipsLevel: "Beginner Explorer",
                rewardPoints: 0,
                monthlySpent: 0,
                growthPercentage: 0,
              }
            );
          } catch {
            setStats({
              totalBookings: 0,
              completedTours: 0,
              totalSpent: 0,
              favoriteGuides: 0,
              savedWishlist: 0,
              averageRating: 0,
              totalReviews: 0,
              membershipsLevel: "Beginner Explorer",
              rewardPoints: 0,
              monthlySpent: 0,
              growthPercentage: 0,
            });
          }
        };

        // Load profile
        const fetchProfile = async () => {
          try {
            const me = await touristService.getProfile();
            setProfile(me);
            setEditName(me?.name || "");
            setEditPhone(me?.phone || "");
          } catch {
            setProfile(null);
          }
        };

        // Load activities
        const fetchRecentActivities = async () => {
          try {
            const activitiesData = await touristService.getRecentActivities(
              user.id
            );
            setRecentActivities(activitiesData || []);
          } catch {
            setRecentActivities([]);
          }
        };

        await Promise.allSettled([
          fetchTouristStats(),
          fetchProfile(),
          fetchRecentActivities(),
        ]);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    loadTouristData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert("Name is required");
      return;
    }
    setUpdating(true);
    try {
      await touristService.updateProfile({
        name: editName.trim(),
        phone: editPhone.trim(),
      });
      setProfile((prev) =>
        prev
          ? { ...prev, name: editName.trim(), phone: editPhone.trim() }
          : { name: editName.trim(), phone: editPhone.trim() }
      );
      alert("Profile updated successfully!");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    trend,
    className,
    onClick,
    isLoading,
  }) => (
    <div
      className={`modern-stat-card ${className || ""} ${
        onClick ? "clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        {typeof trend === "number" && !Number.isNaN(trend) ? (
          <div className={`trend ${trend > 0 ? "positive" : "negative"}`}>
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        ) : null}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{isLoading ? "..." : value}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const QuickActionCard = ({ icon, label, description, onClick, className }) => (
    <div className={`quick-action-card ${className || ""}`} onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <h4>{label}</h4>
        <p>{description}</p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="modern-dashboard-content">
      {error && (
        <div className="error-banner">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="stats-grid-modern">
        <StatCard
          icon={<FaCalendarCheck />}
          title="Total Bookings"
          value={stats.totalBookings}
          className="bookings-card"
          onClick={() => navigate("/tourist/bookings")}
          isLoading={loading}
        />
        <StatCard
          icon={<FaRoute />}
          title="Completed Tours"
          value={stats.completedTours}
          trend={stats.growthPercentage}
          className="completed-card"
          isLoading={loading}
        />
        <StatCard
          icon={<FaDollarSign />}
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          subtitle={`${formatCurrency(stats.monthlySpent)} this month`}
          trend={15.3}
          className="earnings-card revenue"
          onClick={() => navigate("/tourist/expenses")}
          isLoading={loading}
        />
        <StatCard
          icon={<FaStar />}
          title="Average Rating"
          value={`${stats.averageRating}/5.0`}
          subtitle={`Based on ${stats.totalReviews} reviews`}
          className="rating-card"
          isLoading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <div className="section-header-modern">
          <div className="section-title">
            <h2>Quick Actions</h2>
            <p>Explore, book, and manage your adventures</p>
          </div>
        </div>
        <div className="quick-actions-grid">
          <QuickActionCard
            icon={<FaSearch />}
            label="Browse Tours"
            description="Discover amazing tours and experiences"
            onClick={() => navigate("/tours")}
            className="action-browse"
          />
          <QuickActionCard
            icon={<FaCalendarCheck />}
            label="My Bookings"
            description="View and manage your bookings"
            onClick={() => navigate("/tourist/bookings")}
            className="action-bookings"
          />
          <QuickActionCard
            icon={<FaComments />}
            label="Leave Review"
            description="Share your tour experiences"
            onClick={() => navigate("/tourist/reviews")}
            className="action-reviews"
          />
          <QuickActionCard
            icon={<FaHeadset />}
            label="Support Center"
            description="Get help and contact support"
            onClick={() => navigate("/tourist/support")}
            className="action-support"
          />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid-modern">
        {/* Tourist Profile */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Tourist Profile</h3>
            <button className="view-all-btn" onClick={() => setShowEditModal(true)}>
              Edit Profile
            </button>
          </div>
          <div className="card-content">
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {profile?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {profile?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {profile?.phone || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {profile?.role || "tourist"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button
              className="view-all-btn"
              onClick={() => navigate("/tourist/activities")}
            >
              View All
            </button>
          </div>
          <div className="card-content">
            {recentActivities.length > 0 ? (
              <div className="activities-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item-modern">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <h4 className="activity-title">{activity.title}</h4>
                      <p className="activity-description">
                        {activity.description}
                      </p>
                      <span className="activity-time">
                        <FaClock />{" "}
                        {new Date(activity.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <span>
                  Your activity history will appear here once you start booking
                  tours
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Tourist Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="modal-body">
                <div className="edit-form">
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="tel"
                      id="phone"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-apply" disabled={updating}>
                  <FaCheck style={{ marginRight: "8px" }} />
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-cancel"
                >
                  <FaTimes style={{ marginRight: "8px" }} />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Auth guard
  if (!user) {
    return (
      <div className="error-container">
        <div className="error-content">
          <FaExclamationTriangle className="error-icon" />
          <h2>Authentication Required</h2>
          <p>Please log in to access your dashboard.</p>
          <button className="retry-btn" onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role && user.role !== "tourist") {
    return (
      <div className="error-container">
        <div className="error-content">
          <FaExclamationTriangle className="error-icon" />
          <h2>Access Restricted</h2>
          <p>This dashboard is only available for tourists.</p>
          <button className="retry-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <FaExclamationTriangle className="error-icon" />
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard-page">
      {/* Modern Header */}
      <div className="modern-dashboard-header">
        <div className="header-brand">
          <h1>Tourist Dashboard</h1>
          <p>
            Welcome back,{" "}
            <span className="user-name">
              {profile?.name || user?.name || "Traveler"}
            </span>
            ! Ready for your next adventure?
          </p>
        </div>

        <div className="header-navigation">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`nav-button ${activeView === "dashboard" ? "active" : ""}`}
          >
            <FaHome />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-button ${activeView === "bookings" ? "active" : ""}`}
            onClick={() => navigate("/tourist/bookings")}
          >
            <FaCalendarCheck />
            <span>My Bookings</span>
          </button>
          <button
            className={`nav-button ${activeView === "support" ? "active" : ""}`}
            onClick={() => navigate("/tourist/support")}
          >
            <FaHeadset />
            <span>Support</span>
          </button>
          <button
            className={`nav-button ${activeView === "reviews" ? "active" : ""}`}
            onClick={() => navigate("/tourist/reviews")}
          >
            <FaStar />
            <span>Reviews</span>
          </button>
        </div>

        <div className="header-actions">
          <div className="user-level">
            <span className="level-badge">{stats.membershipsLevel}</span>
            <span className="points">{stats.rewardPoints} pts</span>
          </div>
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">2</span>
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-main">{renderDashboard()}</div>
    </div>
  );
};

export default TouristDashboard;
