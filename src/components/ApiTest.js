import React, { useState, useEffect } from "react";
import apiService from "../services/api";

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("unknown");

  useEffect(() => {
    // Test environment variables and backend on component mount
    testEnvVars();
    testBackendHealth();
  }, []);

  // Test Environment Variables
  const testEnvVars = () => {
    try {
      console.log("🔧 Testing Environment Variables...");

      const envTests = {
        googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
          ? "✅ Present"
          : "❌ Missing",
        openaiKey: process.env.REACT_APP_OPENAI_API_KEY
          ? "✅ Present"
          : "❌ Missing",
        momoPartner: process.env.REACT_APP_MOMO_PARTNER_CODE
          ? "✅ Present"
          : "❌ Missing",
        apiUrl: process.env.REACT_APP_API_URL ? "✅ Present" : "❌ Missing",
        frontendUrl: process.env.REACT_APP_FRONTEND_URL
          ? "✅ Present"
          : "❌ Missing",
        appName: process.env.REACT_APP_APP_NAME ? "✅ Present" : "❌ Missing",
      };

      console.log("Environment Variables:", envTests);
      setTestResults((prev) => ({ ...prev, env: envTests }));
    } catch (error) {
      console.error("Error testing env vars:", error);
      setTestResults((prev) => ({
        ...prev,
        env: { error: "Failed to load environment variables" },
      }));
    }
  };

  // Test Backend Health
  const testBackendHealth = async () => {
    setLoading(true);
    try {
      console.log("🔍 Testing Backend Health...");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/health`
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Backend Health Check Passed:", data);
        setBackendStatus("online");
        setTestResults((prev) => ({
          ...prev,
          backendHealth: `✅ Backend Online - ${data.message}`,
        }));
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Backend Health Check Failed:", error);
      setBackendStatus("offline");
      setTestResults((prev) => ({
        ...prev,
        backendHealth: `❌ Backend Offline: ${error.message}`,
      }));
    }
    setLoading(false);
  };

  // Test API Authentication
  const testAuthAPI = async () => {
    setLoading(true);
    try {
      console.log("🔐 Testing Authentication API...");

      // Test login endpoint with demo credentials
      const loginData = {
        email: "tourist@example.com",
        password: "123456",
        userType: "tourist",
      };

      const response = await apiService.post("/auth/login", loginData);
      console.log("✅ Auth API Test Passed:", response);

      setTestResults((prev) => ({
        ...prev,
        authAPI: "✅ Authentication API Working",
      }));

      // Store token for other tests
      if (response.token) {
        apiService.setAuthToken(response.token);
      }
    } catch (error) {
      console.error("❌ Auth API Test Failed:", error);
      setTestResults((prev) => ({
        ...prev,
        authAPI: `❌ Auth API Error: ${error.message}`,
      }));
    }
    setLoading(false);
  };

  // Test Guides API
  const testGuidesAPI = async () => {
    setLoading(true);
    try {
      console.log("👥 Testing Guides API...");

      const response = await apiService.get("/guides");
      console.log("✅ Guides API Test Passed:", response);

      setTestResults((prev) => ({
        ...prev,
        guidesAPI: `✅ Guides API Working (${
          response.length || 0
        } guides found)`,
      }));
    } catch (error) {
      console.error("❌ Guides API Test Failed:", error);
      setTestResults((prev) => ({
        ...prev,
        guidesAPI: `❌ Guides API Error: ${error.message}`,
      }));
    }
    setLoading(false);
  };

  // Test Bookings API
  const testBookingsAPI = async () => {
    setLoading(true);
    try {
      console.log("📅 Testing Bookings API...");

      const response = await apiService.get("/bookings");
      console.log("✅ Bookings API Test Passed:", response);

      setTestResults((prev) => ({
        ...prev,
        bookingsAPI: `✅ Bookings API Working (${
          response.length || 0
        } bookings found)`,
      }));
    } catch (error) {
      console.error("❌ Bookings API Test Failed:", error);
      setTestResults((prev) => ({
        ...prev,
        bookingsAPI: `❌ Bookings API Error: ${error.message}`,
      }));
    }
    setLoading(false);
  };

  // Test Database Connection
  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      console.log("🗄️ Testing Database Connection...");

      // Test by trying to fetch guides (which requires DB)
      const response = await apiService.get("/guides");

      if (response) {
        setTestResults((prev) => ({
          ...prev,
          database: "✅ Database Connection Working",
        }));
      }
    } catch (error) {
      console.error("❌ Database Test Failed:", error);
      setTestResults((prev) => ({
        ...prev,
        database: `❌ Database Error: ${error.message}`,
      }));
    }
    setLoading(false);
  };

  // Test Google Maps API
  const testGoogleMaps = () => {
    setLoading(true);
    console.log("🗺️ Testing Google Maps API...");

    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setTestResults((prev) => ({
          ...prev,
          googleMaps: "❌ API Key Missing",
        }));
        setLoading(false);
        return;
      }

      // Simple test - just check if API key format is correct
      if (apiKey.startsWith("AIza")) {
        setTestResults((prev) => ({
          ...prev,
          googleMaps: "✅ Google Maps API Key Format Valid",
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          googleMaps: "❌ Invalid API Key Format",
        }));
      }
    } catch (error) {
      console.error("Google Maps test error:", error);
      setTestResults((prev) => ({
        ...prev,
        googleMaps: "❌ Error testing Google Maps",
      }));
    }
    setLoading(false);
  };

  // Test OpenAI API
  const testOpenAI = async () => {
    setLoading(true);
    console.log("🤖 Testing OpenAI API...");

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

      if (!apiKey) {
        setTestResults((prev) => ({
          ...prev,
          openai: "❌ API Key Missing",
        }));
        setLoading(false);
        return;
      }

      // Simple test - check API key format
      if (apiKey.startsWith("sk-")) {
        setTestResults((prev) => ({
          ...prev,
          openai: "✅ OpenAI API Key Format Valid",
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          openai: "❌ Invalid API Key Format",
        }));
      }
    } catch (error) {
      console.error("OpenAI test error:", error);
      setTestResults((prev) => ({
        ...prev,
        openai: "❌ Error testing OpenAI",
      }));
    }
    setLoading(false);
  };

  // Test MoMo Configuration
  const testMoMo = () => {
    console.log("💳 Testing MoMo Configuration...");

    try {
      const momoConfig = {
        partnerCode: process.env.REACT_APP_MOMO_PARTNER_CODE,
        accessKey: process.env.REACT_APP_MOMO_ACCESS_KEY,
        secretKey: process.env.REACT_APP_MOMO_SECRET_KEY,
        endpoint: process.env.REACT_APP_MOMO_ENDPOINT,
      };

      const configuredCount = Object.values(momoConfig).filter(
        (value) => value
      ).length;

      if (configuredCount === 4) {
        setTestResults((prev) => ({
          ...prev,
          momo: "✅ MoMo Configuration Complete (4/4)",
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          momo: `⚠️ MoMo Configuration Partial (${configuredCount}/4)`,
        }));
      }
    } catch (error) {
      console.error("MoMo test error:", error);
      setTestResults((prev) => ({
        ...prev,
        momo: "❌ Error testing MoMo configuration",
      }));
    }
  };

  // Run all backend tests
  const runAllBackendTests = async () => {
    setLoading(true);
    await testBackendHealth();
    if (backendStatus === "online") {
      await testAuthAPI();
      await testGuidesAPI();
      await testBookingsAPI();
      await testDatabaseConnection();
    }
    setLoading(false);
  };

  const buttonStyle = {
    padding: "10px 15px",
    margin: "5px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007cba",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  };

  const resultStyle = {
    margin: "5px 0",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    fontFamily: "monospace",
    fontSize: "14px",
  };

  const statusStyle = {
    padding: "15px",
    borderRadius: "8px",
    margin: "20px 0",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    backgroundColor:
      backendStatus === "online"
        ? "#d4edda"
        : backendStatus === "offline"
        ? "#f8d7da"
        : "#e2e3e5",
    color:
      backendStatus === "online"
        ? "#155724"
        : backendStatus === "offline"
        ? "#721c24"
        : "#6c757d",
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        minHeight: "500px",
      }}
    >
      <h1
        style={{
          color: "#333",
          borderBottom: "2px solid #007cba",
          paddingBottom: "10px",
        }}
      >
        🧪 TourConnect Frontend-Backend Testing Dashboard
      </h1>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        This page tests your frontend-backend integration, API connectivity, and
        third-party services.
      </p>

      {/* Backend Status */}
      <div style={statusStyle}>
        Backend Status:{" "}
        {backendStatus === "online"
          ? "🟢 ONLINE"
          : backendStatus === "offline"
          ? "🔴 OFFLINE"
          : "🟡 UNKNOWN"}
      </div>

      {/* Environment Variables Section */}
      <div
        style={{
          marginBottom: "30px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>📋 Environment Variables Status</h2>
        {testResults.env ? (
          <div>
            {Object.entries(testResults.env).map(([key, value]) => (
              <div key={key} style={resultStyle}>
                <strong>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </strong>{" "}
                {value}
              </div>
            ))}
          </div>
        ) : (
          <p>Loading environment variables...</p>
        )}
      </div>

      {/* Backend API Tests */}
      <div
        style={{
          marginBottom: "30px",
          backgroundColor: "#fff3cd",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>🔗 Backend API Tests</h2>
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={testBackendHealth}
            disabled={loading}
            style={buttonStyle}
          >
            Test Backend Health
          </button>
          <button onClick={testAuthAPI} disabled={loading} style={buttonStyle}>
            Test Authentication
          </button>
          <button
            onClick={testGuidesAPI}
            disabled={loading}
            style={buttonStyle}
          >
            Test Guides API
          </button>
          <button
            onClick={testBookingsAPI}
            disabled={loading}
            style={buttonStyle}
          >
            Test Bookings API
          </button>
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            style={buttonStyle}
          >
            Test Database
          </button>
          <button
            onClick={runAllBackendTests}
            disabled={loading}
            style={{ ...buttonStyle, backgroundColor: "#28a745" }}
          >
            🚀 Run All Backend Tests
          </button>
        </div>

        {/* Backend Test Results */}
        <div>
          {testResults.backendHealth && (
            <div style={resultStyle}>
              <strong>Backend Health:</strong> {testResults.backendHealth}
            </div>
          )}
          {testResults.authAPI && (
            <div style={resultStyle}>
              <strong>Authentication API:</strong> {testResults.authAPI}
            </div>
          )}
          {testResults.guidesAPI && (
            <div style={resultStyle}>
              <strong>Guides API:</strong> {testResults.guidesAPI}
            </div>
          )}
          {testResults.bookingsAPI && (
            <div style={resultStyle}>
              <strong>Bookings API:</strong> {testResults.bookingsAPI}
            </div>
          )}
          {testResults.database && (
            <div style={resultStyle}>
              <strong>Database:</strong> {testResults.database}
            </div>
          )}
        </div>
      </div>

      {/* Frontend API Tests */}
      <div
        style={{
          marginBottom: "30px",
          backgroundColor: "#d1ecf1",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>🔌 Frontend API Tests</h2>
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={testGoogleMaps}
            disabled={loading}
            style={buttonStyle}
          >
            Test Google Maps
          </button>
          <button onClick={testOpenAI} disabled={loading} style={buttonStyle}>
            Test OpenAI
          </button>
          <button onClick={testMoMo} style={buttonStyle}>
            Test MoMo Config
          </button>
        </div>

        {/* Frontend Test Results */}
        <div>
          {testResults.googleMaps && (
            <div style={resultStyle}>
              <strong>Google Maps:</strong> {testResults.googleMaps}
            </div>
          )}
          {testResults.openai && (
            <div style={resultStyle}>
              <strong>OpenAI:</strong> {testResults.openai}
            </div>
          )}
          {testResults.momo && (
            <div style={resultStyle}>
              <strong>MoMo:</strong> {testResults.momo}
            </div>
          )}
        </div>
      </div>

      {/* Current Configuration */}
      <div
        style={{
          backgroundColor: "#e9ecef",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        <h3>⚙️ Current Configuration:</h3>
        <div
          style={{
            fontSize: "12px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          {`Environment: ${process.env.NODE_ENV || "development"}
App Name: ${process.env.REACT_APP_APP_NAME || "Not Set"}
Frontend URL: ${process.env.REACT_APP_FRONTEND_URL || "Not Set"}
Backend API URL: ${process.env.REACT_APP_API_URL || "http://localhost:5000"}
Current URL: ${
            typeof window !== "undefined" ? window.location.href : "Server Side"
          }

Backend Status: ${backendStatus}
Auth Token: ${localStorage.getItem("authToken") ? "Present ✅" : "Not Set ❌"}

API Keys Status:
- Google Maps: ${
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY
              ? "Configured ✅"
              : "Missing ❌"
          }
- OpenAI: ${
            process.env.REACT_APP_OPENAI_API_KEY
              ? "Configured ✅"
              : "Missing ❌"
          }
- MoMo Partner: ${
            process.env.REACT_APP_MOMO_PARTNER_CODE
              ? "Configured ✅"
              : "Missing ❌"
          }`}
        </div>
      </div>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          Testing API... Please wait...
        </div>
      )}
    </div>
  );
};

export default ApiTest;
