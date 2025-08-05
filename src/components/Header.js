import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirect to home page after logout
    setTimeout(() => {
      navigate("/");
    }, 100); // Small delay to ensure logout completes
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <Link to="/" className="logo">
          TourConnect
        </Link>
      </div>

      <nav className="nav-menu">
        <Link to="/guides">Find Guides</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/help">Help</Link>
        <Link to="/careers">Careers</Link>

        {isAuthenticated && (
          <Link to="/book-tour" className="book-tour-link">
            Book Tour
          </Link>
        )}

        {isAuthenticated ? (
          <div className="user-menu">
            <span className="user-greeting">
              <span className="greeting-text">Hi, </span>
              <span className="user-name">
                {(user.name || user.email).split(" ")[0]}
              </span>
              {user.userType === "guide" && (
                <span className="user-role"> (Guide)</span>
              )}
              {user.userType === "admin" && (
                <span className="user-role"> (Admin)</span>
              )}
              {user.userType === "support" && (
                <span className="user-role"> (Support)</span>
              )}
              {user.userType === "tourist" && (
                <span className="user-role"> (Tourist)</span>
              )}
            </span>

            {user.userType === "tourist" && (
              <Link to="/tourist/dashboard" className="dashboard-link">
                Dashboard
              </Link>
            )}

            {user.userType === "guide" && (
              <Link to="/guide/dashboard" className="dashboard-link">
                Dashboard
              </Link>
            )}

            {user.userType === "admin" && (
              <Link to="/admin/dashboard" className="dashboard-link">
                Admin
              </Link>
            )}

            {user.userType === "support" && (
              <Link to="/support/dashboard" className="dashboard-link">
                Support
              </Link>
            )}

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
