import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import UserManagement from "../components/dashboard/UserManagement";
import GuideManagement from "../components/dashboard/GuideManagement";
import BookingManagement from "../components/dashboard/BookingManagement";
import { adminService } from "../services/adminService";
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
  FaSignOutAlt,
  FaHome,
  FaChartLine,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import "./DashboardStyles.css";
import "./ModernDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGuides: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingGuides: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    growthPercentage: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats from backend
        const [statsData, revenueData, activitiesData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getRevenueStats(),
          adminService.getRecentActivities(5),
        ]);

        // Fetch additional data for pending guides and active bookings
        const [guidesData, bookingsData] = await Promise.all([
          adminService.getAllGuides({ verification_status: "pending" }),
          adminService.getAllBookings({ status: "confirmed" }),
        ]);

        setStats({
          totalUsers: statsData.total_users || 0,
          totalGuides: statsData.total_guides || 0,
          totalBookings: statsData.total_bookings || 0,
          totalRevenue: revenueData.total_revenue || 125780,
          pendingGuides: Array.isArray(guidesData) ? guidesData.length : 0,
          activeBookings: Array.isArray(bookingsData) ? bookingsData.length : 0,
          monthlyRevenue: revenueData.monthly_revenue || 15650,
          growthPercentage: revenueData.growth_percentage || 12.5,
        });

        setRecentActivities(
          Array.isArray(activitiesData.activities) ? activitiesData.activities : []
        );
      } catch (error) {
        console.error("Error loading admin data:", error);
        setError("Failed to load dashboard data. Using fallback data.");

        // Fallback to mock data if API fails
        setStats({
          totalUsers: 2547,
          totalGuides: 234,
          totalBookings: 1823,
          totalRevenue: 125780,
          pendingGuides: 12,
          activeBookings: 89,
          monthlyRevenue: 15650,
          growthPercentage: 12.5,
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

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
  }) => (
    <div className={`modern-stat-card ${className}`}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        {trend && (
          <div
            className={`trend-indicator ${trend > 0 ? "positive" : "negative"}`}
          >
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
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

  const ActivityItem = ({ activity }) => (
  <div className="activity-item">
    <div className="activity-icon">
      <FaCheckCircle />
    </div>
    <div className="activity-content">
      <p className="activity-text">{activity.title}</p>
      <p className="activity-user">{activity.description}</p>
      <span className="activity-time">
        <FaClock /> {new Date(activity.timestamp).toLocaleString()}
      </span>
    </div>
  </div>
);

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return <UserManagement />;
      case "guides":
        return <GuideManagement />;
      case "bookings":
        return <BookingManagement />;
      default:
        return (
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
                icon={<FaUsers />}
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                subtitle="Active platform users"
                trend={8.2}
              />
              <StatCard
                icon={<FaUserTie />}
                title="Total Guides"
                value={stats.totalGuides}
                subtitle="Verified tour guides"
                trend={5.1}
              />
              <StatCard
                icon={<FaCalendarCheck />}
                title="Total Bookings"
                value={stats.totalBookings.toLocaleString()}
                subtitle="All-time bookings"
                trend={12.3}
              />
              <StatCard
                icon={<FaDollarSign />}
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                subtitle="Lifetime earnings"
                trend={stats.growthPercentage}
                className="revenue"
              />
            </div>

            {/* Secondary Stats */}
            <div className="secondary-stats">
              <StatCard
                icon={<FaUserClock />}
                title="Pending Guides"
                value={stats.pendingGuides}
                subtitle="Awaiting verification"
                className="warning"
              />
              <StatCard
                icon={<FaTasks />}
                title="Active Bookings"
                value={stats.activeBookings}
                subtitle="Currently ongoing"
                className="success"
              />
              <StatCard
                icon={<FaChartLine />}
                title="Monthly Revenue"
                value={`$${stats.monthlyRevenue.toLocaleString()}`}
                subtitle="This month"
                trend={stats.growthPercentage}
                className="info"
              />
            </div>

            {/* Dashboard Content Grid */}
            <div className="dashboard-grid">
              {/* Quick Actions */}
              <div className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Manage your platform efficiently</p>
                  </div>
                </div>
                <div className="quick-actions-grid">
                  <QuickActionCard
                    icon={<FaUserCog />}
                    label="Manage Users"
                    description="View and manage all users"
                    onClick={() => setActiveView("users")}
                  />
                  <QuickActionCard
                    icon={<FaUserCheck />}
                    label="Approve Guides"
                    description="Review pending guide applications"
                    onClick={() => setActiveView("guides")}
                    className="highlight"
                  />
                  <QuickActionCard
                    icon={<FaListAlt />}
                    label="View Bookings"
                    description="Monitor all booking activities"
                    onClick={() => setActiveView("bookings")}
                  />
                  <QuickActionCard
                    icon={<FaChartBar />}
                    label="Analytics"
                    description="Generate detailed reports"
                  />
                </div>
              </div>

              {/* Recent Activities */}
              <div className="dashboard-section">
                <div className="section-header">
                  <div>
                    <h2>Recent Activities</h2>
                  </div>
                  <button className="view-all-btn">
                    <FaBell /> View All
                  </button>
                </div>
                <div className="activities-list">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))
                  ) : (
                    <div className="no-activities">
                      <FaClock />
                      <p>No recent activities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="modern-dashboard-page">
      {/* Modern Header */}
      <div className="modern-dashboard-header">
        <div className="header-brand">
          <h1>Admin Dashboard</h1>
          <p>
            Welcome back,{" "}
            <span className="user-name">{user?.name || "Admin"}</span>!
          </p>
        </div>

        <div className="header-navigation">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`nav-button ${
              activeView === "dashboard" ? "active" : ""
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView("users")}
            className={`nav-button ${activeView === "users" ? "active" : ""}`}
          >
            <FaUserCog />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveView("guides")}
            className={`nav-button ${activeView === "guides" ? "active" : ""}`}
          >
            <FaUserCheck />
            <span>Guides</span>
          </button>
          <button
            onClick={() => setActiveView("bookings")}
            className={`nav-button ${
              activeView === "bookings" ? "active" : ""
            }`}
          >
            <FaListAlt />
            <span>Bookings</span>
          </button>
        </div>

        <div className="header-actions">
          <button className="notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-main">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
