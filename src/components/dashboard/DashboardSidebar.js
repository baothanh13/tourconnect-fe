import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardSidebar.css";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      {
        path: `/${user?.role}/dashboard`,
        label: "Dashboard",
        icon: "📊",
      },
    ];

    switch (user?.role) {
      case "admin":
        return [
          ...baseItems,
          {
            path: "/admin/users",
            label: "User Management",
            icon: "👥",
          },
          {
            path: "/admin/guides",
            label: "Guide Management",
            icon: "🗺️",
          },
          {
            path: "/admin/bookings",
            label: "Bookings",
            icon: "📅",
          },
          {
            path: "/admin/reports",
            label: "Reports",
            icon: "📈",
          },
          {
            path: "/admin/settings",
            label: "Settings",
            icon: "⚙️",
          },
        ];

      case "guide":
        return [
          ...baseItems,
          {
            path: "/guide/profile",
            label: "My Profile",
            icon: "👤",
          },
          {
            path: "/guide/tours",
            label: "My Tours",
            icon: "🎯",
          },
          {
            path: "/guide/bookings",
            label: "Bookings",
            icon: "📅",
          },
          {
            path: "/guide/earnings",
            label: "Earnings",
            icon: "💰",
          },
          {
            path: "/guide/reviews",
            label: "Reviews",
            icon: "⭐",
          },
        ];

      case "support":
        return [
          ...baseItems,
          {
            path: "/support/tickets",
            label: "Support Tickets",
            icon: "🎫",
          },
          {
            path: "/support/users",
            label: "User Support",
            icon: "👥",
          },
          {
            path: "/support/guides",
            label: "Guide Support",
            icon: "🗺️",
          },
        ];

      case "tourist":
        return [
          ...baseItems,
          {
            path: "/tourist/bookings",
            label: "My Bookings",
            icon: "📅",
          },
          {
            path: "/tourist/wishlist",
            label: "Wishlist",
            icon: "❤️",
          },
          {
            path: "/tourist/profile",
            label: "Profile",
            icon: "👤",
          },
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="dashboard-sidebar">
      <nav className="dashboard-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
