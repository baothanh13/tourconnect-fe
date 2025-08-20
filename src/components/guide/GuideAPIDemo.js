import React, { useState } from "react";
import GuideManagement from "./GuideManagement";
import FindGuideByUser from "./FindGuideByUser";
import GuideProfileEditor from "./GuideProfileEditor";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaList,
  FaSearch,
  FaPlus,
  FaUser,
  FaCode,
  FaArrowRight,
} from "react-icons/fa";
import "./GuideComponents.css";

const GuideAPIDemo = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/guides",
      description: "Create a new guide profile",
      color: "#28a745",
      implementation: "GuideProfileEditor (mode: create)",
    },
    {
      method: "GET",
      endpoint: "/api/guides/{id}",
      description: "Get guide profile by ID",
      color: "#007bff",
      implementation: "GuideManagement (view/edit actions)",
    },
    {
      method: "PUT",
      endpoint: "/api/guides/{id}",
      description: "Update guide profile by ID",
      color: "#ffc107",
      implementation: "GuideProfileEditor (mode: edit)",
    },
    {
      method: "GET",
      endpoint: "/api/guides/user/{userId}",
      description: "Get guide profile by user ID",
      color: "#007bff",
      implementation: "FindGuideByUser component",
    },
    {
      method: "POST",
      endpoint: "/api/guides/profile",
      description: "Create guide profile for existing user",
      color: "#28a745",
      implementation: "GuideProfileEditor (mode: createProfile)",
    },
  ];

  const tabs = [
    { id: "overview", label: "API Overview", icon: FaCode },
    { id: "management", label: "Guide Management", icon: FaList },
    { id: "findByUser", label: "Find by User ID", icon: FaSearch },
    { id: "createNew", label: "Create New Guide", icon: FaPlus },
    { id: "createProfile", label: "Create My Profile", icon: FaUser },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "management":
        return <GuideManagement />;

      case "findByUser":
        return <FindGuideByUser />;

      case "createNew":
        return (
          <div className="tab-content">
            <h3>Create New Guide Profile</h3>
            <p>Create a completely new guide profile with user information.</p>
            <GuideProfileEditor mode="create" />
          </div>
        );

      case "createProfile":
        return (
          <div className="tab-content">
            <h3>Create Guide Profile for Current User</h3>
            <p>Create a guide profile for your current user account.</p>
            <GuideProfileEditor mode="createProfile" userId={user?.id} />
          </div>
        );

      default:
        return (
          <div className="api-overview">
            <div className="overview-header">
              <h3>Guide API Endpoints</h3>
              <p>Complete UI implementation for all Guide management APIs</p>
            </div>

            <div className="endpoints-grid">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="endpoint-card">
                  <div className="endpoint-header">
                    <span
                      className="method-badge"
                      style={{ backgroundColor: endpoint.color }}
                    >
                      {endpoint.method}
                    </span>
                    <code className="endpoint-path">{endpoint.endpoint}</code>
                  </div>
                  <div className="endpoint-body">
                    <p className="endpoint-description">
                      {endpoint.description}
                    </p>
                    <div className="endpoint-implementation">
                      <strong>Implementation:</strong>
                      <span>{endpoint.implementation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="getting-started">
              <h4>Getting Started</h4>
              <div className="steps-list">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h5>Browse All Guides</h5>
                    <p>
                      Click on "Guide Management" to see all guide profiles,
                      search, and perform CRUD operations.
                    </p>
                    <button
                      onClick={() => setActiveTab("management")}
                      className="step-btn"
                    >
                      Open Guide Management <FaArrowRight />
                    </button>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h5>Find Guide by User ID</h5>
                    <p>
                      Search for a specific guide profile using their User ID.
                    </p>
                    <button
                      onClick={() => setActiveTab("findByUser")}
                      className="step-btn"
                    >
                      Find by User ID <FaArrowRight />
                    </button>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h5>Create Your Guide Profile</h5>
                    <p>Create a guide profile for your current user account.</p>
                    <button
                      onClick={() => setActiveTab("createProfile")}
                      className="step-btn"
                    >
                      Create My Profile <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="features-list">
              <h4>Features Implemented</h4>
              <div className="features-grid">
                <div className="feature-item">
                  <h5>🔍 Search & Filter</h5>
                  <p>
                    Search guides by location, specialties, languages, and more
                  </p>
                </div>
                <div className="feature-item">
                  <h5>📝 CRUD Operations</h5>
                  <p>Create, Read, Update, Delete guide profiles</p>
                </div>
                <div className="feature-item">
                  <h5>🎯 User-specific Profiles</h5>
                  <p>Find and manage profiles by User ID</p>
                </div>
                <div className="feature-item">
                  <h5>📱 Responsive Design</h5>
                  <p>Works on desktop, tablet, and mobile devices</p>
                </div>
                <div className="feature-item">
                  <h5>⚡ Real-time API Calls</h5>
                  <p>All operations connect to your backend APIs</p>
                </div>
                <div className="feature-item">
                  <h5>🛡️ Error Handling</h5>
                  <p>Comprehensive error handling and user feedback</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="guide-api-demo">
      <div className="demo-header">
        <h1>Guide API Demo</h1>
        <p>Complete UI implementation for all Guide management endpoints</p>
      </div>

      <div className="demo-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="demo-content">{renderTabContent()}</div>
    </div>
  );
};

export default GuideAPIDemo;
