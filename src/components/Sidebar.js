import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiCalendar,
  FiHeart,
  FiStar,
  FiCompass,
  FiDollarSign,
  FiUser,
  FiSettings,
  FiLogIn,
  FiLogOut,
  FiEdit3,
  FiBarChart2,
  FiBriefcase,
  FiHelpCircle,
  FiInfo,
  FiMessageSquare,
  FiClipboard,
  FiHeadphones,
  FiFileText,
  FiTag,
  FiChevronDown, // Changed FiTicket to FiTag
} from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const handleLogout = () => {
    logout();
    toggleSidebar();
    setTimeout(() => navigate("/"), 100);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 992) toggleSidebar();
  };

  const isActiveLink = (path) => location.pathname === path;

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  const getMenuItems = () => {
    const commonItems = [
      { id: "home", label: "Home", icon: <FiHome />, path: "/", type: "link" },
      {
        id: "guides",
        label: "Find Guides",
        icon: <FiUsers />,
        path: "/guides",
        type: "link",
      },
      {
        id: "categories",
        label: "Categories",
        icon: <FiGrid />,
        type: "submenu",
        submenu: [
          {
            label: "Cultural",
            path: "/guides?category=Cultural%20Tours",
            icon: "🏛️",
          },
          { label: "Food", path: "/guides?category=Food%20Tours", icon: "🍜" },
          {
            label: "Adventure",
            path: "/guides?category=Adventure%20Tours",
            icon: "🏔️",
          },
        ],
      },
    ];

    const guestItems = [
      ...commonItems,
      {
        id: "about",
        label: "About Us",
        icon: <FiInfo />,
        path: "/about",
        type: "link",
      },
      {
        id: "help",
        label: "Help",
        icon: <FiHelpCircle />,
        path: "/help",
        type: "link",
      },
      {
        id: "careers",
        label: "Careers",
        icon: <FiBriefcase />,
        path: "/careers",
        type: "link",
      },
    ];

    const touristItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <FiBarChart2 />,
        path: "/tourist/dashboard",
        type: "link",
      },
      {
        id: "bookings",
        label: "My Bookings",
        icon: <FiCalendar />,
        path: "/tourist/dashboard?tab=bookings",
        type: "link",
      },
      {
        id: "favorites",
        label: "Favorites",
        icon: <FiHeart />,
        path: "/tourist/dashboard?tab=favorites",
        type: "link",
      },
      {
        id: "reviews",
        label: "My Reviews",
        icon: <FiStar />,
        path: "/tourist/dashboard?tab=reviews",
        type: "link",
      },
      ...commonItems,
    ];

    const guideItems = [
      {
        id: "guide-dashboard",
        label: "Dashboard",
        icon: <FiBarChart2 />,
        path: "/guide/dashboard",
        type: "link",
      },
      {
        id: "my-tours",
        label: "My Tours",
        icon: <FiCompass />,
        path: "/guide/tours",
        type: "link",
      },
      {
        id: "earnings",
        label: "Earnings",
        icon: <FiDollarSign />,
        path: "/guide/earnings",
        type: "link",
      },
      {
        id: "profile",
        label: "My Profile",
        icon: <FiUser />,
        path: "/guide/profile",
        type: "link",
      },
      ...commonItems,
    ];

    const adminItems = [
      {
        id: "admin-dashboard",
        label: "Dashboard",
        icon: <FiBarChart2 />,
        path: "/admin/dashboard",
        type: "link",
      },
      {
        id: "users",
        label: "Users",
        icon: <FiUsers />,
        path: "/admin/users",
        type: "link",
      },
      {
        id: "guides-management",
        label: "Guides",
        icon: <FiUser />,
        path: "/admin/guides",
        type: "link",
      },
      {
        id: "bookings-management",
        label: "Bookings",
        icon: <FiClipboard />,
        path: "/admin/bookings",
        type: "link",
      },
      {
        id: "reports",
        label: "Reports",
        icon: <FiFileText />,
        path: "/admin/reports",
        type: "link",
      },
    ];

    const supportItems = [
      {
        id: "support-dashboard",
        label: "Dashboard",
        icon: <FiHeadphones />,
        path: "/support/dashboard",
        type: "link",
      },
      // Corrected the icon below
      {
        id: "tickets",
        label: "Tickets",
        icon: <FiTag />,
        path: "/support/tickets",
        type: "link",
      },
      {
        id: "chat",
        label: "Chat",
        icon: <FiMessageSquare />,
        path: "/support/chat",
        type: "link",
      },
    ];

    if (!isAuthenticated) return guestItems;
    switch (user?.role) {
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

  const menuItems = getMenuItems();

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={handleLinkClick}>
            <span className="logo-icon">🌍</span>
            <span className="logo-text">TourConnect</span>
          </Link>
        </div>

        {isAuthenticated && user && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    user.name || user.email
                  }&background=6366f1&color=fff`
                }
                alt={user.name || "User"}
              />
            </div>
            <div className="profile-info">
              {/* <span className="profile-name">{user.name || user.email}</span> */}
              {/* <span className="profile-role">{user.role}</span> */}
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
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
                        <FiChevronDown />
                      </span>
                    </button>
                    <ul
                      className={`submenu ${
                        activeSubmenu === item.id ? "open" : ""
                      }`}
                    >
                      {item.submenu.map((sub, i) => (
                        <li key={i}>
                          <Link
                            to={sub.path}
                            className="submenu-link"
                            onClick={handleLinkClick}
                          >
                            <span className="submenu-icon">{sub.icon}</span>
                            <span className="submenu-text">{sub.label}</span>
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

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <>
              <Link
                to="/settings"
                className="footer-link"
                onClick={handleLinkClick}
              >
                <span className="footer-icon">
                  <FiSettings />
                </span>
                <span className="footer-text">Settings</span>
              </Link>
              <button onClick={handleLogout} className="footer-button logout">
                <span className="footer-icon">
                  <FiLogOut />
                </span>
                <span className="footer-text">Logout</span>
              </button>
            </>
          ) : (
            <div className="auth-actions">
              <Link
                to="/login"
                className="auth-button login"
                onClick={handleLinkClick}
              >
                <FiLogIn /> Login
              </Link>
              <Link
                to="/register"
                className="auth-button register"
                onClick={handleLinkClick}
              >
                <FiEdit3 /> Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
