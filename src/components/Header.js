import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo">
        TourConnect
      </Link>

      <nav className="nav-menu">
        <Link to="/guides">Tìm Hướng Dẫn Viên</Link>

        {isAuthenticated ? (
          <div className="user-menu">
            <span className="user-greeting">
              Xin chào, {user.name || user.email}
              {user.userType === "guide" && " (HDV)"}
              {user.userType === "admin" && " (Admin)"}
              {user.userType === "support" && " (Hỗ trợ)"}
            </span>

            {user.userType === "guide" && (
              <Link to="/guide/dashboard" className="dashboard-link">
                Dashboard
              </Link>
            )}

            {user.userType === "admin" && (
              <Link to="/admin/dashboard" className="dashboard-link">
                Admin Panel
              </Link>
            )}

            <button onClick={handleLogout} className="logout-btn">
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Đăng Nhập</Link>
            <Link to="/register" className="register-link">
              Đăng Ký
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
