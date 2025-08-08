import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleLogout = () => {
    logout();
    toggleSidebar();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        id: "home",
        label: "Home",
        icon: "🏠",
        path: "/",
        type: "link",
      },
      {
        id: "guides",
        label: "Find Guides",
        icon: "👥",
        path: "/guides",
        type: "link",
      },
      {
        id: "categories",
        label: "Tour Categories",
        icon: "🗂️",
        type: "submenu",
        submenu: [
          {
            label: "Cultural Tours",
            path: "/guides?category=Cultural%20Tours",
            icon: "🏛️",
          },
          {
            label: "Food Tours",
            path: "/guides?category=Food%20Tours",
            icon: "🍜",
          },
          {
            label: "Adventure Tours",
            path: "/guides?category=Adventure%20Tours",
            icon: "🏔️",
          },
          {
            label: "Historical Sites",
            path: "/guides?category=Historical%20Sites",
            icon: "🏺",
          },
          {
            label: "Photography Tours",
            path: "/guides?category=Photography%20Tours",
            icon: "📸",
          },
          {
            label: "Nature Tours",
            path: "/guides?category=Nature%20Tours",
            icon: "🌿",
          },
        ],
      },
    ];

    const guestItems = [
      ...commonItems,
      {
        id: "about",
        label: "About Us",
        icon: "ℹ️",
        path: "/about",
        type: "link",
      },
      {
        id: "help",
        label: "Help",
        icon: "❓",
        path: "/help",
        type: "link",
      },
      {
        id: "careers",
        label: "Careers",
        icon: "💼",
        path: "/careers",
        type: "link",
      },
    ];

    const touristItems = [
      ...commonItems,
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "📊",
        path: "/tourist/dashboard",
        type: "link",
      },
      {
        id: "bookings",
        label: "My Bookings",
        icon: "📅",
        path: "/tourist/dashboard?tab=bookings",
        type: "link",
      },
      {
        id: "favorites",
        label: "Favorite Guides",
        icon: "❤️",
        path: "/tourist/dashboard?tab=favorites",
        type: "link",
      },
      {
        id: "reviews",
        label: "My Reviews",
        icon: "⭐",
        path: "/tourist/dashboard?tab=reviews",
        type: "link",
      },
    ];

    const guideItems = [
      ...commonItems,
      {
        id: "guide-dashboard",
        label: "Guide Dashboard",
        icon: "🎯",
        path: "/guide/dashboard",
        type: "link",
      },
      {
        id: "my-tours",
        label: "My Tours",
        icon: "🗺️",
        path: "/guide/tours",
        type: "link",
      },
      {
        id: "earnings",
        label: "Earnings",
        icon: "💰",
        path: "/guide/earnings",
        type: "link",
      },
      {
        id: "profile",
        label: "Guide Profile",
        icon: "👤",
        path: "/guide/profile",
        type: "link",
      },
    ];

    const adminItems = [
      {
        id: "admin-dashboard",
        label: "Admin Dashboard",
        icon: "⚙️",
        path: "/admin/dashboard",
        type: "link",
      },
      {
        id: "users",
        label: "User Management",
        icon: "👥",
        path: "/admin/users",
        type: "link",
      },
      {
        id: "guides-management",
        label: "Guide Management",
        icon: "🎯",
        path: "/admin/guides",
        type: "link",
      },
      {
        id: "bookings-management",
        label: "Booking Management",
        icon: "📋",
        path: "/admin/bookings",
        type: "link",
      },
      {
        id: "reports",
        label: "Reports",
        icon: "📊",
        path: "/admin/reports",
        type: "link",
      },
    ];

    const supportItems = [
      {
        id: "support-dashboard",
        label: "Support Dashboard",
        icon: "🎧",
        path: "/support/dashboard",
        type: "link",
      },
      {
        id: "tickets",
        label: "Support Tickets",
        icon: "🎫",
        path: "/support/tickets",
        type: "link",
      },
      {
        id: "chat",
        label: "Support Chat",
        icon: "💬",
        path: "/support/chat",
        type: "link",
      },
    ];

    if (!isAuthenticated) return guestItems;

    switch (user?.userType || user?.role) {
      case "tourist":
        return touristItems;
      case "guide":
        return guideItems;
      case "admin":
        return adminItems;
      case "support":
        return supportItems;
      default:
        return guestItems;
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={handleLinkClick}>
            <span className="logo-icon">🌟</span>
            <span className="logo-text">TourConnect</span>
          </Link>
          <button className="sidebar-close" onClick={toggleSidebar}>
            ✕
          </button>
        </div>

        {/* User Profile Section */}
        {isAuthenticated && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <img
                src="/api/placeholder/60/60"
                alt={user?.name || "User"}
                className="avatar-image"
              />
              <div className="profile-status online"></div>
            </div>
            <div className="profile-info">
              <h3 className="profile-name">{user?.name || user?.email}</h3>
              <p className="profile-role">
                {user?.userType === "tourist" && "Tourist"}
                {user?.userType === "guide" && "Tour Guide"}
                {user?.userType === "admin" && "Administrator"}
                {user?.userType === "support" && "Support"}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {getMenuItems().map((item) => (
              <li key={item.id} className="nav-item">
                {item.type === "link" ? (
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      isActiveLink(item.path) ? "active" : ""
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      className={`nav-button ${
                        activeSubmenu === item.id ? "active" : ""
                      }`}
                      onClick={() => toggleSubmenu(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.label}</span>
                      <span
                        className={`nav-arrow ${
                          activeSubmenu === item.id ? "rotated" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    <ul
                      className={`submenu ${
                        activeSubmenu === item.id ? "submenu-open" : ""
                      }`}
                    >
                      {item.submenu.map((subItem, index) => (
                        <li key={index} className="submenu-item">
                          <Link
                            to={subItem.path}
                            className="submenu-link"
                            onClick={handleLinkClick}
                          >
                            <span className="submenu-icon">{subItem.icon}</span>
                            <span className="submenu-text">
                              {subItem.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="footer-actions">
              <Link
                to="/settings"
                className="footer-link"
                onClick={handleLinkClick}
              >
                <span className="footer-icon">⚙️</span>
                <span className="footer-text">Settings</span>
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                <span className="footer-icon">🚪</span>
                <span className="footer-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link
                to="/login"
                className="auth-button login"
                onClick={handleLinkClick}
              >
                <span className="auth-icon">🔑</span>
                <span className="auth-text">Login</span>
              </Link>
              <Link
                to="/register"
                className="auth-button register"
                onClick={handleLinkClick}
              >
                <span className="auth-icon">📝</span>
                <span className="auth-text">Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {isAuthenticated && user?.userType === "tourist" && (
          <div className="quick-actions">
            <h4 className="quick-title">Hành động nhanh</h4>
            <div className="quick-buttons">
              <Link
                to="/guides"
                className="quick-btn"
                onClick={handleLinkClick}
              >
                <span>🔍</span>
                <span>Find Guides</span>
              </Link>
              <Link
                to="/tourist/dashboard?tab=bookings"
                className="quick-btn"
                onClick={handleLinkClick}
              >
                <span>📅</span>
                <span>Book Tours</span>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
