import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardHeader.css";

export const DashboardHeader = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  const getDashboardTitle = () => {
    if (location.pathname.includes("/admin")) return "Admin Dashboard";
    if (location.pathname.includes("/guide")) return "Guide Dashboard";
    if (location.pathname.includes("/support")) return "Support Dashboard";
    if (location.pathname.includes("/tourist")) return "Tourist Dashboard";
    return "Dashboard";
  };

  const getNavItems = () => {
    const baseItems = [];

    if (user?.role === "admin") {
      baseItems.push({
        path: "/admin/dashboard",
        label: "Overview",
        icon: "📊",
      });
    } else if (user?.role === "guide") {
      baseItems.push({
        path: "/guide/dashboard",
        label: "Overview",
        icon: "📊",
      });
    } else if (user?.role === "support") {
      baseItems.push({
        path: "/support/dashboard",
        label: "Overview",
        icon: "📊",
      });
    } else if (user?.role === "tourist") {
      baseItems.push({
        path: "/tourist/dashboard",
        label: "Overview",
        icon: "📊",
      });
    }

    return baseItems;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <Link to="/" className="dashboard-logo">
          TourConnect
        </Link>
        <span className="dashboard-subtitle">{getDashboardTitle()}</span>

        <nav className="dashboard-nav">
          {getNavItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="dashboard-header-right">
        <div className="user-info">
          <div className="user-details">
            <span className="user-name">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </span>
            <span className="user-role">
              {user?.role &&
                user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        <div className="dashboard-actions">
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
