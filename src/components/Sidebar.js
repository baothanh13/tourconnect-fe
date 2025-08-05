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
        label: "Trang chủ",
        icon: "🏠",
        path: "/",
        type: "link",
      },
      {
        id: "guides",
        label: "Tìm hướng dẫn viên",
        icon: "👥",
        path: "/guides",
        type: "link",
      },
      {
        id: "categories",
        label: "Danh mục tour",
        icon: "🗂️",
        type: "submenu",
        submenu: [
          {
            label: "Tour văn hóa",
            path: "/guides?category=Cultural%20Tours",
            icon: "🏛️",
          },
          {
            label: "Tour ẩm thực",
            path: "/guides?category=Food%20Tours",
            icon: "🍜",
          },
          {
            label: "Tour phiêu lưu",
            path: "/guides?category=Adventure%20Tours",
            icon: "🏔️",
          },
          {
            label: "Di tích lịch sử",
            path: "/guides?category=Historical%20Sites",
            icon: "🏺",
          },
          {
            label: "Tour nhiếp ảnh",
            path: "/guides?category=Photography%20Tours",
            icon: "📸",
          },
          {
            label: "Tour thiên nhiên",
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
        label: "Về chúng tôi",
        icon: "ℹ️",
        path: "/about",
        type: "link",
      },
      {
        id: "help",
        label: "Trợ giúp",
        icon: "❓",
        path: "/help",
        type: "link",
      },
      {
        id: "careers",
        label: "Tuyển dụng",
        icon: "💼",
        path: "/careers",
        type: "link",
      },
    ];

    const touristItems = [
      ...commonItems,
      {
        id: "dashboard",
        label: "Bảng điều khiển",
        icon: "📊",
        path: "/tourist/dashboard",
        type: "link",
      },
      {
        id: "bookings",
        label: "Đặt tour của tôi",
        icon: "📅",
        path: "/tourist/dashboard?tab=bookings",
        type: "link",
      },
      {
        id: "favorites",
        label: "HDV yêu thích",
        icon: "❤️",
        path: "/tourist/dashboard?tab=favorites",
        type: "link",
      },
      {
        id: "reviews",
        label: "Đánh giá của tôi",
        icon: "⭐",
        path: "/tourist/dashboard?tab=reviews",
        type: "link",
      },
    ];

    const guideItems = [
      ...commonItems,
      {
        id: "guide-dashboard",
        label: "Bảng điều khiển HDV",
        icon: "🎯",
        path: "/guide/dashboard",
        type: "link",
      },
      {
        id: "my-tours",
        label: "Tour của tôi",
        icon: "🗺️",
        path: "/guide/tours",
        type: "link",
      },
      {
        id: "earnings",
        label: "Thu nhập",
        icon: "💰",
        path: "/guide/earnings",
        type: "link",
      },
      {
        id: "profile",
        label: "Hồ sơ HDV",
        icon: "👤",
        path: "/guide/profile",
        type: "link",
      },
    ];

    const adminItems = [
      {
        id: "admin-dashboard",
        label: "Bảng điều khiển Admin",
        icon: "⚙️",
        path: "/admin/dashboard",
        type: "link",
      },
      {
        id: "users",
        label: "Quản lý người dùng",
        icon: "👥",
        path: "/admin/users",
        type: "link",
      },
      {
        id: "guides-management",
        label: "Quản lý HDV",
        icon: "🎯",
        path: "/admin/guides",
        type: "link",
      },
      {
        id: "bookings-management",
        label: "Quản lý đặt tour",
        icon: "📋",
        path: "/admin/bookings",
        type: "link",
      },
      {
        id: "reports",
        label: "Báo cáo",
        icon: "📊",
        path: "/admin/reports",
        type: "link",
      },
    ];

    const supportItems = [
      {
        id: "support-dashboard",
        label: "Bảng điều khiển Hỗ trợ",
        icon: "🎧",
        path: "/support/dashboard",
        type: "link",
      },
      {
        id: "tickets",
        label: "Phiếu hỗ trợ",
        icon: "🎫",
        path: "/support/tickets",
        type: "link",
      },
      {
        id: "chat",
        label: "Chat hỗ trợ",
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
                {user?.userType === "tourist" && "Du khách"}
                {user?.userType === "guide" && "Hướng dẫn viên"}
                {user?.userType === "admin" && "Quản trị viên"}
                {user?.userType === "support" && "Hỗ trợ"}
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
                <span className="footer-text">Cài đặt</span>
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                <span className="footer-icon">🚪</span>
                <span className="footer-text">Đăng xuất</span>
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
                <span className="auth-text">Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="auth-button register"
                onClick={handleLinkClick}
              >
                <span className="auth-icon">📝</span>
                <span className="auth-text">Đăng ký</span>
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
                <span>Tìm HDV</span>
              </Link>
              <Link
                to="/tourist/dashboard?tab=bookings"
                className="quick-btn"
                onClick={handleLinkClick}
              >
                <span>📅</span>
                <span>Đặt tour</span>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
