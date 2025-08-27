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
  FaUsers,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaTrendUp,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCamera,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaHeadset,
  FaShare,
  FaGlobe,
  FaSpinner,
  FaHeart,
} from "react-icons/fa";
import "./DashboardStyles.css";
import "./ModernDashboard.css";
import "./GuideDashboard.css";

const GuideDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
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
    monthlyEarnings: 0,
    growthPercentage: 0,
    totalCustomers: 0,
    activeTours: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const refreshDashboard = async () => {
    if (!user || !user.id || !guideProfile?.id) return;

    try {
      setRefreshing(true);
      setError(null);

      // Refresh all dashboard data
      const dashboardData = await guideDashboardService.getGuideDashboardData(
        user.id,
        guideProfile.id
      );

      const apiStats = dashboardData.stats || {};
      const enhancedStats = {
        totalTours: apiStats.totalTours || 0,
        completedTours: apiStats.completedBookings || 0,
        upcomingTours: apiStats.upcomingTours || 0,
        pendingBookings: apiStats.pendingBookings || 0,
        totalEarnings: parseFloat(apiStats.totalEarnings) || 0,
        monthlyEarnings: parseFloat(apiStats.monthlyEarnings) || 0,
        growthPercentage: apiStats.growthPercentage || 0,
        averageRating: apiStats.averageRating || 0,
        totalReviews: apiStats.totalReviews || 0,
        totalCustomers:
          apiStats.totalCustomers ||
          Math.round((apiStats.completedBookings || 0) * 1.5),
        activeTours:
          (apiStats.totalTours || 0) - (apiStats.completedBookings || 0),
        verificationStatus:
          apiStats.verificationStatus ||
          guideProfile.verification_status ||
          "pending",
      };

      setStats(enhancedStats);

      // Refresh activities and bookings
      const [activities, upcoming] = await Promise.all([
        guideDashboardService.getRecentActivities(user.id, 5).catch(() => []),
        guideDashboardService.getUpcomingBookings(user.id, 5).catch(() => []),
      ]);

      setRecentActivities(activities);
      setUpcomingBookings(upcoming);
    } catch (error) {
      setError(`Failed to refresh dashboard: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadGuideData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First get guide profile by user ID
        const profile = await guidesService.getGuideByUserId(user.id);

        if (!profile || !profile.id) {
          // Guide profile doesn't exist yet - redirect to profile creation
          navigate("/guide/profile/create");
          return;
        }

        setGuideProfile(profile);

        // Use the guide ID to fetch dashboard data from the API
        const dashboardData = await guideDashboardService.getGuideDashboardData(
          user.id,
          profile.id
        );

        // Use stats from API response directly, with fallback calculations
        const apiStats = dashboardData.stats || {};
        const enhancedStats = {
          totalTours: apiStats.totalTours || 0,
          completedTours: apiStats.completedBookings || 0,
          upcomingTours: apiStats.upcomingTours || 0,
          pendingBookings: apiStats.pendingBookings || 0,
          totalEarnings: parseFloat(apiStats.totalEarnings) || 0,
          monthlyEarnings: parseFloat(apiStats.monthlyEarnings) || 0,
          growthPercentage: apiStats.growthPercentage || 0,
          averageRating: apiStats.averageRating || 0,
          totalReviews: apiStats.totalReviews || 0,
          totalCustomers:
            apiStats.totalCustomers ||
            Math.round((apiStats.completedBookings || 0) * 1.5),
          activeTours:
            (apiStats.totalTours || 0) - (apiStats.completedBookings || 0),
          verificationStatus:
            apiStats.verificationStatus ||
            profile.verification_status ||
            "pending",
        };

        setStats(enhancedStats);

        // Fetch additional data concurrently
        const [activities, upcoming] = await Promise.all([
          guideDashboardService.getRecentActivities(user.id, 5).catch(() => []),
          guideDashboardService.getUpcomingBookings(user.id, 5).catch(() => []),
        ]);

        setRecentActivities(activities);
        setUpcomingBookings(upcoming);
      } catch (error) {
        setError(`Failed to load dashboard: ${error.message}`);

        // Set fallback stats to prevent UI breaking
        setStats({
          totalTours: 0,
          completedTours: 0,
          upcomingTours: 0,
          pendingBookings: 0,
          totalEarnings: 0,
          averageRating: 0,
          totalReviews: 0,
          verificationStatus: "pending",
          monthlyEarnings: 0,
          growthPercentage: 0,
          totalCustomers: 0,
          activeTours: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadGuideData();
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

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return <Loading />;
  }

  const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    trend,
    className = "",
    onClick,
    isLoading = false,
  }) => (
    <div
      className={`modern-stat-card ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="stat-header">
        <div className="stat-icon">
          {isLoading ? <FaSpinner className="spinner" /> : icon}
        </div>
        {trend !== undefined && trend !== null && (
          <div
            className={`trend-indicator ${trend > 0 ? "positive" : "negative"}`}
          >
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{isLoading ? "..." : value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickActionCard = ({
    icon,
    label,
    description,
    onClick,
    className = "",
  }) => (
    <div className={`quick-action-card ${className}`} onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <h4>{label}</h4>
        <p>{description}</p>
      </div>
    </div>
  );

  return (
    <div className="modern-dashboard-page">
      {/* Modern Header */}
      <header className="modern-dashboard-header">
        <div className="header-brand">
          <h1>Guide Dashboard</h1>
          <p>
            {getTimeBasedGreeting()},{" "}
            <span className="user-name">
              {user?.name || guideProfile?.name || "Guide"}
            </span>
            ! Ready to guide today?
          </p>
        </div>

        <div className="header-navigation">
          <button
            className={`nav-button ${
              activeView === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveView("dashboard")}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </button>
          <button
            className={`nav-button ${activeView === "tours" ? "active" : ""}`}
            onClick={() => navigate("/guide/tours")}
          >
            <FaRoute />
            <span>My Tours</span>
          </button>
          <button
            className={`nav-button ${
              activeView === "bookings" ? "active" : ""
            }`}
            onClick={() => navigate("/guide/bookings")}
          >
            <FaCalendarCheck />
            <span>Bookings</span>
          </button>
          <button
            className={`nav-button ${
              activeView === "earnings" ? "active" : ""
            }`}
            onClick={() => navigate("/guide/earnings")}
          >
            <FaDollarSign />
            <span>Earnings</span>
          </button>
        </div>

        <div className="header-actions">
          {guideProfile && (
            <div className="verification-status">
              <span
                className={`verification-badge ${getVerificationStatusColor(
                  stats.verificationStatus
                )}`}
              >
                <FaCheckCircle />
                {stats.verificationStatus.charAt(0).toUpperCase() +
                  stats.verificationStatus.slice(1)}
              </span>
            </div>
          )}
          <button
            className="refresh-btn"
            onClick={refreshDashboard}
            disabled={refreshing}
            title="Refresh dashboard data"
          >
            {refreshing ? <FaSpinner className="spinner" /> : "🔄"}
          </button>
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="modern-dashboard-content">
          {error && (
            <div className="error-banner">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          {/* Statistics Grid */}
          <div className="stats-grid-modern">
            <StatCard
              icon={<FaRoute />}
              title="Total Tours"
              value={stats.totalTours}
              subtitle={`${stats.activeTours} active`}
              className="tours-card"
              onClick={() => navigate("/guide/tours")}
              isLoading={loading}
            />
            <StatCard
              icon={<FaCalendarCheck />}
              title="Completed Tours"
              value={stats.completedTours}
              trend={8.2}
              className="completed-card"
              isLoading={loading}
            />
            <StatCard
              icon={<FaDollarSign />}
              title="Total Earnings"
              value={formatCurrency(stats.totalEarnings)}
              subtitle={`${formatCurrency(stats.monthlyEarnings)} this month`}
              trend={stats.growthPercentage}
              className="earnings-card"
              onClick={() => navigate("/guide/earnings")}
              isLoading={loading}
            />
            <StatCard
              icon={<FaStar />}
              title="Average Rating"
              value={
                stats.averageRating
                  ? `${stats.averageRating} ⭐`
                  : "No ratings yet"
              }
              subtitle={`${stats.totalReviews} reviews`}
              className="rating-card"
              onClick={() => navigate("/guide/reviews")}
              isLoading={loading}
            />
            <StatCard
              icon={<FaClock />}
              title="Pending Bookings"
              value={stats.pendingBookings}
              subtitle={
                stats.pendingBookings > 0 ? "Need attention" : "All caught up!"
              }
              className="pending-card"
              onClick={() => navigate("/guide/bookings?status=pending")}
              isLoading={loading}
            />
            <StatCard
              icon={<FaUsers />}
              title="Total Customers"
              value={stats.totalCustomers}
              subtitle="Served customers"
              trend={5.3}
              className="customers-card"
              isLoading={loading}
            />
          </div>

          {/* Quick Actions */}
          <div className="section-container">
            <div className="section-header">
              <h2>Quick Actions</h2>
              <p>Manage your guide business efficiently</p>
            </div>
            <div className="quick-actions-grid">
              <QuickActionCard
                icon={<FaPlus />}
                label="Create New Tour"
                description="Design and publish a new tour experience"
                onClick={() => navigate("/guide/tours/new")}
                className="action-create"
              />
              <QuickActionCard
                icon={<FaEdit />}
                label="Update Profile"
                description="Edit your guide profile and information"
                onClick={() => navigate("/guide/profile")}
                className="action-profile"
              />
              <QuickActionCard
                icon={<FaCalendarAlt />}
                label="Manage Schedule"
                description="Set your availability and time slots"
                onClick={() => navigate("/guide/schedule")}
                className="action-schedule"
              />
              <QuickActionCard
                icon={<FaChartLine />}
                label="View Analytics"
                description="Check performance and insights"
                onClick={() => navigate("/guide/analytics")}
                className="action-analytics"
              />
              <QuickActionCard
                icon={<FaCamera />}
                label="Upload Photos"
                description="Add photos to your tours and profile"
                onClick={() => navigate("/guide/photos")}
                className="action-photos"
              />
              <QuickActionCard
                icon={<FaHeadset />}
                label="Support Center"
                description="Get help and contact support"
                onClick={() => navigate("/guide/support")}
                className="action-support"
              />
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="dashboard-grid-modern">
            {/* Recent Activities */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Activities</h3>
                <button
                  className="view-all-btn"
                  onClick={() => navigate("/guide/activities")}
                >
                  View All
                </button>
              </div>
              <div className="card-content">
                {recentActivities.length > 0 ? (
                  <div className="activities-list">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="activity-item-modern">
                        <div className={`activity-icon ${activity.type}`}>
                          {activity.type === "booking" && <FaCalendarAlt />}
                          {activity.type === "review" && <FaStar />}
                          {activity.type === "payment" && <FaDollarSign />}
                        </div>
                        <div className="activity-content">
                          <h4 className="activity-title">{activity.title}</h4>
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
                    ))}
                  </div>
                ) : loading ? (
                  <div className="empty-state">
                    <FaSpinner className="spinner" />
                    <p>Loading activities...</p>
                    <span>
                      Please wait while we fetch your recent activities
                    </span>
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaClock />
                    <p>No recent activities</p>
                    <span>
                      Your activity history will appear here once you start
                      engaging with tourists
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Bookings */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Upcoming Bookings</h3>
                <button
                  className="view-all-btn"
                  onClick={() => navigate("/guide/bookings")}
                >
                  View All
                </button>
              </div>
              <div className="card-content">
                {upcomingBookings.length > 0 ? (
                  <div className="bookings-list">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="booking-item-modern">
                        <div className="booking-date">
                          <span className="date">
                            {formatDate(booking.date)}
                          </span>
                          <span className="time">
                            {formatTime(booking.time_slot)}
                          </span>
                        </div>
                        <div className="booking-details">
                          <h4 className="tourist-name">
                            {booking.tourist_name || "Tourist"}
                          </h4>
                          <p className="booking-info">
                            {booking.number_of_tourists}{" "}
                            {booking.number_of_tourists === 1
                              ? "person"
                              : "people"}{" "}
                            • {formatCurrency(booking.total_price)}
                          </p>
                        </div>
                        <div className="booking-actions">
                          <button
                            className="btn-view-modern"
                            onClick={() =>
                              navigate(`/guide/bookings/${booking.id}`)
                            }
                            title="View booking details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : loading ? (
                  <div className="empty-state">
                    <FaSpinner className="spinner" />
                    <p>Loading bookings...</p>
                    <span>
                      Please wait while we fetch your upcoming bookings
                    </span>
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaCalendarAlt />
                    <p>No upcoming bookings</p>
                    <span>
                      New bookings will appear here. Start promoting your tours
                      to get booked!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuideDashboard;
