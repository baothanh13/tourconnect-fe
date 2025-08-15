import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./DashboardHeader.css";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "guide":
        return "Guide";
      case "support":
        return "Support Staff";
      case "tourist":
        return "Tourist";
      default:
        return "User";
    }
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1 className="dashboard-logo">TourConnect</h1>
        <span className="dashboard-subtitle">Dashboard</span>
      </div>

      <div className="dashboard-header-right">
        <div className="user-info">
          <span className="user-name">{user?.name || user?.email}</span>
          <span className="user-role">{getRoleDisplayName(user?.role)}</span>
        </div>

        <div className="dashboard-actions">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
