import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { adminService } from "../services/adminService";
import { guidesService } from "../services/guidesService";
import { bookingsService } from "../services/bookingsService";
import { usersService } from "../services/usersService";
import Loading from "../components/Loading";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time data states
  const [stats, setStats] = useState({
    totalGuides: 0,
    totalTourists: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeUsers: 0,
  });

  const [guides, setGuides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activities, setActivities] = useState([]);

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parallel API calls for better performance
        const [dashboardStats, allGuides, allBookings, recentActivities] =
          await Promise.all([
            adminService.getDashboardStats(),
            guidesService.getAllGuides({ includeUnverified: true }),
            bookingsService.getAllBookings(),
            adminService.getRecentActivities(),
          ]);

        setStats(dashboardStats);
        setGuides(allGuides);
        setBookings(allBookings);
        setActivities(recentActivities);
      } catch (err) {
        setError(err.message);
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.userType === "admin") {
      fetchDashboardData();
    }
  }, [user]);

  // Real API handlers
  const handleVerifyGuide = async (guideId) => {
    try {
      await adminService.verifyGuide(guideId);

      // Update local state
      setGuides((prevGuides) =>
        prevGuides.map((guide) =>
          guide.id === guideId
            ? {
                ...guide,
                isVerified: true,
                verifiedAt: new Date().toISOString(),
              }
            : guide
        )
      );

      // Update stats
      setStats((prevStats) => ({
        ...prevStats,
        pendingVerifications: prevStats.pendingVerifications - 1,
      }));

      alert("Guide verified successfully!");
    } catch (error) {
      alert(`Failed to verify guide: ${error.message}`);
    }
  };

  const handleSuspendUser = async (userId, reason = "") => {
    try {
      await adminService.suspendUser(userId, reason);

      // Update local state
      setGuides((prevGuides) =>
        prevGuides.map((guide) =>
          guide.id === userId
            ? {
                ...guide,
                status: "suspended",
                suspendedAt: new Date().toISOString(),
              }
            : guide
        )
      );

      alert("User suspended successfully!");
    } catch (error) {
      alert(`Failed to suspend user: ${error.message}`);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await bookingsService.updateBookingStatus(bookingId, action);

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: action,
                updatedAt: new Date().toISOString(),
              }
            : booking
        )
      );

      alert(`Booking ${action} successfully!`);
    } catch (error) {
      alert(`Failed to ${action} booking: ${error.message}`);
    }
  };

  // Loading and error states
  if (loading) {
    return <Loading message="Loading admin dashboard..." size="large" />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Access control
  if (!user || user.userType !== "admin") {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>This dashboard is only accessible to system administrators.</p>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalGuides.toLocaleString()}</h3>
            <p>Total Guides</p>
            <small className="stat-trend">
              +{stats.guidesGrowth || 0}% this month
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">🧳</div>
          <div className="stat-content">
            <h3>{stats.totalTourists.toLocaleString()}</h3>
            <p>Total Tourists</p>
            <small className="stat-trend">
              +{stats.touristsGrowth || 0}% this month
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalBookings.toLocaleString()}</h3>
            <p>Total Bookings</p>
            <small className="stat-trend">
              +{stats.bookingsGrowth || 0}% this month
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalRevenue.toLocaleString()}</h3>
            <p>Platform Revenue</p>
            <small className="stat-trend">
              +{stats.revenueGrowth || 0}% this month
            </small>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingVerifications}</h3>
            <p>Pending Verifications</p>
            {stats.pendingVerifications > 0 && (
              <small className="stat-alert">Requires attention</small>
            )}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.activeUsers.toLocaleString()}</h3>
            <p>Active Users</p>
            <small className="stat-info">Last 30 days</small>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Platform Activities</h3>
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <span className="activity-time">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management">
      <div className="management-header">
        <h3>User Management ({guides.length} total)</h3>
        <div className="management-filters">
          <select className="filter-select">
            <option value="all">All Users</option>
            <option value="guides">Guides Only</option>
            <option value="tourists">Tourists Only</option>
            <option value="pending">Pending Verification</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="btn-export">Export Data</button>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <span>User</span>
          <span>Type</span>
          <span>Status</span>
          <span>Joined</span>
          <span>Last Active</span>
          <span>Actions</span>
        </div>

        {guides.map((guide) => (
          <div key={guide.id} className="user-row">
            <div className="user-info">
              <img
                src={guide.avatar || "/default-avatar.png"}
                alt={guide.name}
                className="user-avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div>
                <h4>{guide.name}</h4>
                <p>{guide.email}</p>
                <small>{guide.location}</small>
              </div>
            </div>

            <span className="user-type guide">{guide.userType || "Guide"}</span>

            <span
              className={`user-status ${
                guide.status || (guide.isVerified ? "verified" : "pending")
              }`}
            >
              {guide.status === "suspended"
                ? "Suspended"
                : guide.isVerified
                ? "Verified"
                : "Pending"}
            </span>

            <span className="join-date">
              {new Date(
                guide.createdAt || guide.joinedDate
              ).toLocaleDateString()}
            </span>

            <span className="last-active">
              {guide.lastLoginAt
                ? new Date(guide.lastLoginAt).toLocaleDateString()
                : "Never"}
            </span>

            <div className="user-actions">
              {!guide.isVerified && guide.status !== "suspended" && (
                <button
                  onClick={() => handleVerifyGuide(guide.id)}
                  className="btn-verify"
                  disabled={loading}
                >
                  Verify
                </button>
              )}

              {guide.status !== "suspended" && (
                <button
                  onClick={() => handleSuspendUser(guide.id)}
                  className="btn-suspend"
                  disabled={loading}
                >
                  Suspend
                </button>
              )}

              <button className="btn-view">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookingManagement = () => (
    <div className="booking-management">
      <div className="management-header">
        <h3>Booking Management ({bookings.length} total)</h3>
        <div className="management-filters">
          <select className="filter-select">
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputes">Disputes</option>
          </select>
          <button className="btn-export">Export Bookings</button>
        </div>
      </div>

      <div className="bookings-table">
        <div className="table-header">
          <span>Booking ID</span>
          <span>Tourist</span>
          <span>Guide</span>
          <span>Date</span>
          <span>Status</span>
          <span>Amount</span>
          <span>Actions</span>
        </div>

        {bookings.map((booking) => (
          <div key={booking.id} className="booking-row">
            <span className="booking-id">#{booking.id}</span>
            <span className="tourist-name">
              {booking.tourist?.name || `Tourist #${booking.touristId}`}
            </span>
            <span className="guide-name">
              {booking.guide?.name || `Guide #${booking.guideId}`}
            </span>
            <span className="booking-date">
              {new Date(booking.date || booking.startDate).toLocaleDateString()}
            </span>
            <span className={`booking-status ${booking.status}`}>
              {booking.status.toUpperCase()}
            </span>
            <span className="booking-amount">
              ${booking.totalPrice || booking.amount}
            </span>
            <div className="booking-actions">
              <button
                className="btn-view"
                onClick={() => {
                  /* Navigate to booking details */
                }}
              >
                View
              </button>

              {booking.status === "dispute" && (
                <button
                  className="btn-resolve"
                  onClick={() => handleBookingAction(booking.id, "resolved")}
                  disabled={loading}
                >
                  Resolve
                </button>
              )}

              {booking.status === "pending" && (
                <>
                  <button
                    className="btn-approve"
                    onClick={() => handleBookingAction(booking.id, "confirmed")}
                    disabled={loading}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleBookingAction(booking.id, "cancelled")}
                    disabled={loading}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="content-management">
      <div className="management-header">
        <h3>Content Management</h3>
        <button className="btn-primary">Add New Content</button>
      </div>

      <div className="content-sections">
        <div className="content-card">
          <h4>📝 Platform Policies</h4>
          <p>
            Manage terms of service, privacy policy, and community guidelines
          </p>
          <button className="btn-manage">Manage Policies</button>
        </div>

        <div className="content-card">
          <h4>🏛️ Featured Destinations</h4>
          <p>
            Control which cities and attractions are featured on the homepage
          </p>
          <button className="btn-manage">Manage Destinations</button>
        </div>

        <div className="content-card">
          <h4>📢 Announcements</h4>
          <p>Create and manage platform-wide announcements and news</p>
          <button className="btn-manage">Manage Announcements</button>
        </div>

        <div className="content-card">
          <h4>💬 Support Messages</h4>
          <p>Handle customer support tickets and complaints</p>
          <button className="btn-manage">View Messages</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>TourConnect Platform Management</p>
          <div className="dashboard-actions">
            <button
              className="btn-refresh"
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        <div className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users ({guides.length})
          </button>
          <button
            className={`nav-tab ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Bookings ({bookings.length})
          </button>
          <button
            className={`nav-tab ${activeTab === "content" ? "active" : ""}`}
            onClick={() => setActiveTab("content")}
          >
            📝 Content
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "users" && renderUserManagement()}
          {activeTab === "bookings" && renderBookingManagement()}
          {activeTab === "content" && renderContentManagement()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
