import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaCode,
  FaList,
  FaSearch,
  FaPlus,
  FaUser,
  FaArrowRight,
  FaRocket,
  FaCheck,
} from "react-icons/fa";
import "../components/guide/GuideComponents.css";

const GuideAPITestPage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Complete Guide Management",
      description: "Full CRUD operations for guide profiles",
      icon: FaList,
      link: "/guide/management",
      color: "#007bff",
    },
    {
      title: "Find Guide by User ID",
      description: "Search for guide profiles using User IDs",
      icon: FaSearch,
      link: "/guide/find-by-user",
      color: "#17a2b8",
    },
    {
      title: "API Demo & Documentation",
      description: "Interactive demo of all Guide API endpoints",
      icon: FaCode,
      link: "/guide/api-demo",
      color: "#28a745",
    },
    {
      title: "Profile Editor",
      description: "Create and edit guide profiles",
      icon: FaUser,
      link: "/guide/profile-editor",
      color: "#ffc107",
    },
  ];

  const apiEndpoints = [
    "POST /api/guides - Create a new guide profile",
    "GET /api/guides/{id} - Get guide profile by ID",
    "PUT /api/guides/{id} - Update guide profile by ID",
    "GET /api/guides/user/{userId} - Get guide profile by user ID",
    "POST /api/guides/profile - Create guide profile for existing user",
  ];

  return (
    <div className="guide-api-demo">
      <div className="demo-header">
        <h1>
          <FaRocket /> Guide API Test Suite
        </h1>
        <p>Complete UI implementation for all Guide management APIs</p>
        {user && (
          <div className="user-info">
            <p>
              <strong>Current User:</strong> {user.email} |
              <strong> Role:</strong> {user.role} |<strong> ID:</strong>{" "}
              {user.id}
            </p>
          </div>
        )}
      </div>

      <div className="features-showcase">
        <h2>🚀 Available Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="feature-card"
                style={{ borderTop: `4px solid ${feature.color}` }}
              >
                <div className="feature-icon" style={{ color: feature.color }}>
                  <Icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-action">
                  Launch <FaArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="api-endpoints-section">
        <h2>📋 API Endpoints Implemented</h2>
        <div className="endpoints-list">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="endpoint-item">
              <FaCheck style={{ color: "#28a745" }} />
              <code>{endpoint}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>⚡ Quick Start</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>1. Browse All Guides</h3>
            <p>View, search, and manage all guide profiles in your system</p>
            <Link to="/guide/management" className="action-btn">
              <FaList /> Open Guide Management
            </Link>
          </div>

          <div className="action-card">
            <h3>2. Find by User ID</h3>
            <p>Search for a specific guide profile using their User ID</p>
            <Link to="/guide/find-by-user" className="action-btn">
              <FaSearch /> Find Guide by User
            </Link>
          </div>

          <div className="action-card">
            <h3>3. API Documentation</h3>
            <p>Interactive documentation and testing for all API endpoints</p>
            <Link to="/guide/api-demo" className="action-btn">
              <FaCode /> View API Demo
            </Link>
          </div>

          <div className="action-card">
            <h3>4. Create New Profile</h3>
            <p>Create a new guide profile or update existing ones</p>
            <Link to="/guide/profile-editor" className="action-btn">
              <FaPlus /> Create Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="implementation-info">
        <h2>🔧 Implementation Details</h2>
        <div className="info-grid">
          <div className="info-item">
            <h4>Frontend</h4>
            <ul>
              <li>React.js with Hooks</li>
              <li>React Router for navigation</li>
              <li>Axios for API calls</li>
              <li>FontAwesome icons</li>
              <li>Responsive CSS design</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>Features</h4>
            <ul>
              <li>CRUD operations</li>
              <li>Real-time search & filter</li>
              <li>Form validation</li>
              <li>Error handling</li>
              <li>Loading states</li>
            </ul>
          </div>
          <div className="info-item">
            <h4>API Integration</h4>
            <ul>
              <li>JWT authentication</li>
              <li>Token interceptors</li>
              <li>Error response handling</li>
              <li>Dynamic endpoint calls</li>
              <li>Request/response logging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideAPITestPage;
