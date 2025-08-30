import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import SupportTicketManagement from "../components/dashboard/SupportTicketManagement";
import { supportService } from "../services/supportService";
import {
  FaSignOutAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaUsers,
  FaExclamationCircle,
  FaClock,
  FaUserTie,
  FaHome,
  FaBell,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "./DashboardStyles.css";
import "./ModernDashboard.css";
import "./TouristDashboard.css";
import "./SupportDashboard.css";



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
    urgentTickets: 0,
    averageResponseTime: 0,
    customerSatisfaction: 0,
    monthlyGrowth: 0,
    resolutionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);



  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };



  // Function to refresh dashboard data (can be called from child components)
  const refreshDashboardData = async () => {
    await loadSupportData();
  };

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch support stats from backend
      const statsData = await supportService.getSupportStats();
      
      // Check if statsData is valid
      if (!statsData) {
        throw new Error("No data received from API");
      }

      // Use stats data directly for ticket counts (more efficient)
      const openCount = statsData.open_tickets || 0;
      const pendingCount = statsData.pending_tickets || 0;
      const resolvedCount = statsData.resolved_tickets || 0;
      const closedCount = statsData.closed_tickets || 0;
      const totalCount = openCount + pendingCount + resolvedCount + closedCount;

      // Calculate additional metrics
      const urgentTickets = Math.floor(openCount * 0.3);
      const averageResponseTime = Math.floor(Math.random() * 4) + 1; // Mock data
      const customerSatisfaction = Math.floor(Math.random() * 20) + 80; // Mock data
      const monthlyGrowth = Math.floor(Math.random() * 15) + 5; // Mock data
      
      // Calculate resolution rate
      const resolutionRate = totalCount > 0 ? Math.floor((resolvedCount / totalCount) * 100) : 0;



              setStats({
          openTickets: openCount,
          resolvedTickets: resolvedCount,
          totalUsers: statsData.total_users || 0,
          totalGuides: statsData.total_guides || 0,
          inProgressTickets: pendingCount,
          totalTickets: totalCount,
          urgentTickets: urgentTickets,
          averageResponseTime: averageResponseTime,
          customerSatisfaction: customerSatisfaction,
          monthlyGrowth: monthlyGrowth,
          resolutionRate: resolutionRate,
        });

      // Derive recent activities from tickets or stats if available
      try {
        const ticketsForActivities = await supportService.getAllTickets({ limit: 3, sort: "updated_at", order: "desc" });
        const list = Array.isArray(ticketsForActivities?.data)
          ? ticketsForActivities.data
          : Array.isArray(ticketsForActivities)
          ? ticketsForActivities
          : [];
        const activities = list.map((t, idx) => {
          const timeStr = t.updated_at || t.updatedAt || t.created_at || "";
          const time = timeStr ? new Date(timeStr).toLocaleString() : "N/A";
          return {
            id: t.id || t.ticket_id || t._id || idx,
            type: t.status === "resolved" ? "ticket_resolved" : "ticket_update",
            description: `Ticket #${t.id} - ${t.subject || "Support Request"} is ${t.status}`,
            time: time,
            status: t.status === "resolved" ? "completed" : t.status || "pending",
          };
        });
        setRecentActivities(activities);
      } catch (e) {
        setRecentActivities([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading support data:", error);
      setError("Failed to load dashboard data. Please try again.");
      
      // Fallback to mock data if API fails
      setStats({
        openTickets: 23,
        resolvedTickets: 145,
        totalUsers: 1547,
        totalGuides: 123,
        inProgressTickets: 5,
        totalTickets: 168,
        urgentTickets: 7,
        averageResponseTime: 2.5,
        customerSatisfaction: 92,
        monthlyGrowth: 12,
        resolutionRate: 86,
      });
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const SupportStatCard = ({ icon, title, value, subtitle, trend, className, onClick }) => (
    <div className={`modern-stat-card ${className || ""} ${onClick ? "clickable" : ""}`} onClick={onClick}>
      <div className="stat-header">
        <div className="stat-icon">{icon}</div>
        {typeof trend === "number" && (
          <div className={`trend-indicator ${trend >= 0 ? "positive" : "negative"}`}>
            {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="tourist-dashboard">
      {/* Dashboard Hero */}
      <div className="dashboard-hero">
        <div className="dashboard-container">
        </div>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-container">
        <div className="stats-grid-modern">
          <SupportStatCard
            icon={<FaExclamationCircle />}
            title="Open Tickets"
            value={stats.openTickets}
            subtitle={`${stats.urgentTickets} urgent`}
            className="warning"
          />
          <SupportStatCard
            icon={<FaClock />}
            title="Pending"
            value={stats.inProgressTickets}
            subtitle={`${Math.floor((stats.inProgressTickets / (stats.totalTickets || 1)) * 100)}% of total`}
            className="info"
          />
          <SupportStatCard
            icon={<FaCheckCircle />}
            title="Resolved"
            value={stats.resolvedTickets}
            subtitle={`${stats.resolutionRate}% resolution rate`}
            className="success"
          />
          <SupportStatCard
            icon={<FaTicketAlt />}
            title="Total Tickets"
            value={stats.totalTickets}
            subtitle="All time"
            className="revenue"
          />
          <SupportStatCard
            icon={<FaUsers />}
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            subtitle={`${stats.monthlyGrowth}% growth`}
            className="info"
          />
          <SupportStatCard
            icon={<FaUserTie />}
            title="Total Guides"
            value={stats.totalGuides}
            subtitle={`${Math.floor((stats.totalGuides / (stats.totalUsers || 1)) * 100)}% ratio`}
            className="warning"
          />
        </div>

        {/* Dashboard Tabs */}
        {/* <div className="dashboard-tabs">
          <button className="tab-btn active">Overview</button>
          <button className="tab-btn">Tickets</button>
          <button className="tab-btn">Analytics</button>
          <button className="tab-btn">Settings</button>
        </div> */}

        {/* Recent Activities (restored) */}
        <div className="dashboard-content-wrapper">
          <div className="tab-content">
            <div className="content-grid">
              <div className="content-card">
                <h3>Recent Activities</h3>
                <div className="recent-list">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="recent-item">
                      <div className="item-info">
                        <strong>{activity.description}</strong>
                        <span>{activity.time}</span>
                      </div>
                      <div className={`status-badge ${activity.status}`}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
                {!recentActivities.length && (
                  <div className="empty-state">
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case "tickets":
        return <SupportTicketManagement onTicketUpdate={refreshDashboardData} />;
      default:
        return renderDashboard();
    }
  };



  return (
    <div className="modern-dashboard-page">
      {/* Error Banner */}
      {error && (
        <div className="error-banner" style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px 20px',
          margin: '10px 0',
          borderRadius: '5px',
          border: '1px solid #fcc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c33',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Modern Header */}
      <div className="modern-dashboard-header">
        <div className="header-brand">
          <h1>Support Dashboard</h1>
          <p>
            Welcome back, <span className="user-name">{user?.name || "Support Agent"}</span>! Ready to help?
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
            onClick={() => setActiveView("tickets")}
            className={`nav-button ${activeView === "tickets" ? "active" : ""}`}
          >
            <FaTicketAlt />
            <span>Tickets</span>
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

export default SupportDashboard;
