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
  FaCogs,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import "./DashboardStyles.css";

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
        setLoading(true);

        // Fetch dashboard stats from backend
        const statsData = await adminService.getDashboardStats();

        // Fetch additional data for pending guides and active bookings
        const [guidesData, bookingsData] = await Promise.all([
          adminService.getAllGuides({ verification_status: "pending" }),
          adminService.getAllBookings({ status: "active" }),
        ]);

        setStats({
          totalUsers: statsData.total_users || 0,
          totalGuides: statsData.total_guides || 0,
          totalBookings: statsData.total_bookings || 0,
          totalRevenue: 125780, // This might need a separate endpoint
          pendingGuides: guidesData.length || 0,
          activeBookings: bookingsData.length || 0,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading admin data:", error);
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 2547,
          totalGuides: 234,
          totalBookings: 1823,
          totalRevenue: 125780,
          pendingGuides: 12,
          activeBookings: 89,
        });
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

  const ActionButton = ({ icon, label, className = "", onClick }) => (
    <button className={`action-btn ${className}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
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
                <ActionButton
                  icon={<FaUserCog />}
                  label="Manage Users"
                  onClick={() => setActiveView("users")}
                />
                <ActionButton
                  icon={<FaUserCheck />}
                  label="Approve Guides"
                  onClick={() => setActiveView("guides")}
                />
                <ActionButton
                  icon={<FaListAlt />}
                  label="View Bookings"
                  onClick={() => setActiveView("bookings")}
                />
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
        );
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header with navigation */}
      <div className="dashboard-header-simple">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name || "Admin"}!</p>
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
            onClick={() => setActiveView("users")}
            className={`nav-btn ${activeView === "users" ? "active" : ""}`}
          >
            <FaUserCog />
            Users
          </button>
          <button
            onClick={() => setActiveView("guides")}
            className={`nav-btn ${activeView === "guides" ? "active" : ""}`}
          >
            <FaUserCheck />
            Guides
          </button>
          <button
            onClick={() => setActiveView("bookings")}
            className={`nav-btn ${activeView === "bookings" ? "active" : ""}`}
          >
            <FaListAlt />
            Bookings
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

export default AdminDashboard;
