import React, { useState } from "react";
import { adminService } from "../services/adminService";

const AdminApiTest = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testGuides = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllGuides();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllBookings();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Admin API Test</h2>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testStats}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Test Stats API
        </button>
        <button
          onClick={testUsers}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Test Users API
        </button>
        <button
          onClick={testGuides}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Test Guides API
        </button>
        <button
          onClick={testBookings}
          disabled={loading}
          style={{ margin: "5px" }}
        >
          Test Bookings API
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <pre
        style={{
          background: "#f5f5f5",
          padding: "10px",
          borderRadius: "5px",
          maxHeight: "400px",
          overflow: "auto",
        }}
      >
        {result || "Click a button to test the API"}
      </pre>
    </div>
  );
};

export default AdminApiTest;
