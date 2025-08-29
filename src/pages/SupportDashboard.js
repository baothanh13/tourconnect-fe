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
  FaHeadset,
  FaChartBar,
  FaExclamationCircle,
  FaClock,
  FaUserTie,
  FaHome,
  FaTasks,
  FaUserFriends,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaTrendUp,
  FaMapMarkerAlt,
  FaCamera,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
  FaShare,
  FaGlobe,
  FaSpinner,
  FaHeart,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaRefresh,
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
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const refreshDashboard = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await loadSupportData();
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      setError("Failed to refresh dashboard data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      setLoading(true);

      // Fetch support stats from backend
      const statsData = await supportService.getSupportStats();

      // Calculate additional metrics
      const totalTickets = statsData.open_tickets + statsData.resolved_tickets;
      const urgentTickets = Math.floor(statsData.open_tickets * 0.3);
      const averageResponseTime = Math.floor(Math.random() * 4) + 1; // Mock data
      const customerSatisfaction = Math.floor(Math.random() * 20) + 80; // Mock data
      const monthlyGrowth = Math.floor(Math.random() * 15) + 5; // Mock data

      // Fetch totals via list endpoint (for total tickets) and in-progress via filter
      const listAll = await supportService.getAllTickets({ limit: 1 });
      const totalFromApi = Number(listAll?.total) || 0;

      let inProgressCount = 0;
      try {
        const inProg = await supportService.getAllTickets({ status: "pending", limit: 1 });
        inProgressCount = Number(inProg?.total) || 0;
      } catch (_) {
        inProgressCount = Math.floor(totalTickets * 0.1);
      }

      setStats({
        openTickets: statsData.open_tickets || 0,
        resolvedTickets: statsData.resolved_tickets || 0,
        totalUsers: statsData.total_users || 0,
        totalGuides: statsData.total_guides || 0,
        inProgressTickets: inProgressCount,
        totalTickets: totalFromApi || totalTickets,
        urgentTickets: urgentTickets,
        averageResponseTime: averageResponseTime,
        customerSatisfaction: customerSatisfaction,
        monthlyGrowth: monthlyGrowth,
      });

      // Load recent tickets from backend
      try {
        const ticketsResp = await supportService.getAllTickets({ limit: 5, sort: "created_at", order: "desc" });
        const tickets = Array.isArray(ticketsResp?.data)
          ? ticketsResp.data
          : Array.isArray(ticketsResp)
          ? ticketsResp
          : [];
        const mapped = tickets.map((t) => ({
          id: t.id || t.ticket_id || t._id,
          title: t.title || t.subject || (t.description ? String(t.description).slice(0, 50) : "Support Ticket"),
          user: t.user_name || t.user || t.created_by || "User",
          priority: t.priority || "medium",
          status: t.status || "open",
          date: t.created_at || t.createdAt || t.date || "",
          category: t.category || t.support_type || "General",
        }));
        setRecentTickets(mapped);
      } catch (e) {
        console.warn("Fallback to mock recent tickets due to API error", e);
        setRecentTickets([]);
      }

      // Derive recent activities from tickets or stats if available
      try {
        const ticketsForActivities = await supportService.getAllTickets({ limit: 3, sort: "updated_at", order: "desc" });
        const list = Array.isArray(ticketsForActivities?.data)
          ? ticketsForActivities.data
          : Array.isArray(ticketsForActivities)
          ? ticketsForActivities
          : [];
        const activities = list.map((t, idx) => ({
          id: t.id || t.ticket_id || t._id || idx,
          type: t.status === "resolved" ? "ticket_resolved" : "ticket_update",
          description: `${(t.title || t.subject || "Ticket")} ${t.status ? `is ${t.status}` : "updated"}`,
          time: t.updated_at || t.updatedAt || t.created_at || "",
          status: t.status === "resolved" ? "completed" : t.status || "pending",
        }));
        setRecentActivities(activities);
      } catch (e) {
        setRecentActivities([]);
      }

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
        urgentTickets: 7,
        averageResponseTime: 2.5,
        customerSatisfaction: 92,
        monthlyGrowth: 12,
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
            title="In Progress"
            value={stats.inProgressTickets}
            subtitle={`${Math.floor(stats.inProgressTickets * 0.8)}% active`}
            className="info"
          />
          <SupportStatCard
            icon={<FaCheckCircle />}
            title="Resolved"
            value={stats.resolvedTickets}
            subtitle={`${Math.floor((stats.resolvedTickets / (stats.totalTickets || 1)) * 100)}% success`}
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

        {/* Dashboard Content */}
        <div className="dashboard-content-wrapper">
          <div className="tab-content">
            <div className="content-grid">
              {/* Quick Actions */}
              <div className="dashboard-section">
                <div className="section-header-modern">
                  <div className="section-title">
                    <h2>Quick Actions</h2>
                    <p>Quick actions for support work</p>
                  </div>
                </div>
                <div className="quick-actions-grid">
                  <div className="quick-action-card action-browse" onClick={() => setActiveView("tickets")}>
                    <div className="action-icon"><FaPlus /></div>
                    <div className="action-content">
                      <h4>Create Ticket</h4>
                      <p>Create a new support ticket</p>
                    </div>
                  </div>
                  <div className="quick-action-card" onClick={() => setActiveView("tickets")}>
                    <div className="action-icon urgent"><FaExclamationCircle /></div>
                    <div className="action-content">
                      <h4>Urgent Issues</h4>
                      <p>Filter and handle priority tickets</p>
                    </div>
                  </div>
                  <div className="quick-action-card action-bookings" onClick={() => setActiveView("tickets")}>
                    <div className="action-icon"><FaCheckCircle /></div>
                    <div className="action-content">
                      <h4>Resolve Tickets</h4>
                      <p>Mark open tickets as resolved</p>
                    </div>
                  </div>
                  <div className="quick-action-card action-support" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <div className="action-icon"><FaChartBar /></div>
                    <div className="action-content">
                      <h4>View Reports</h4>
                      <p>View analytics and trends</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="content-card">
                <h3>Recent Tickets</h3>
                <div className="recent-list">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="recent-item">
                      <div className="item-info">
                        <strong>{ticket.title}</strong>
                        <span>{ticket.user} • {ticket.category}</span>
                      </div>
                                             <div className={`status-badge ${ticket.status}`}>
                         {ticket.status.replace('_', ' ')}
                       </div>
                    </div>
                  ))}
                </div>
                <div className="empty-state">
                  <p>View all tickets</p>
                  <a href="#" className="action-link">Manage Tickets →</a>
                </div>
              </div>

              {/* Recent Activities */}
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
                <div className="empty-state">
                  <p>View all activities</p>
                  <a href="#" className="action-link">Activity Log →</a>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="content-card">
                <h3>Performance Metrics</h3>
                <div className="stats-list">
                  <div className="stat-row">
                    <span>Urgent Tickets</span>
                    <span className="stat-value">{stats.urgentTickets}</span>
                  </div>
                  <div className="stat-row">
                    <span>Avg Response Time</span>
                    <span className="stat-value">{stats.averageResponseTime}h</span>
                  </div>
                  <div className="stat-row">
                    <span>Customer Satisfaction</span>
                    <span className="stat-value">{stats.customerSatisfaction}%</span>
                  </div>
                  <div className="stat-row">
                    <span>Monthly Growth</span>
                    <span className="stat-value">+{stats.monthlyGrowth}%</span>
                  </div>
                </div>
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
        return <SupportTicketManagement />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="modern-dashboard-page">
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
