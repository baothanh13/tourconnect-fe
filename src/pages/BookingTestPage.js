import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { bookingsService } from "../services/bookingsService";
import "./BookingTestPage.css";

const BookingTestPage = () => {
  const { user } = useAuth();
  const [bookingData, setBookingData] = useState({
    guideId: "1",
    touristId: "",
    date: "",
    timeSlot: "10:00",
    duration: 8,
    numberOfTourists: 1,
    specialRequests: "",
    totalPrice: 100,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!bookingData.guideId) errors.push("Guide ID is required");
    if (!bookingData.date) errors.push("Date is required");
    if (!bookingData.timeSlot) errors.push("Time slot is required");
    if (!bookingData.numberOfTourists || bookingData.numberOfTourists < 1)
      errors.push("Number of tourists must be at least 1");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Add user ID if available
      const bookingDataWithUser = {
        ...bookingData,
        touristId: user?.id || "test-tourist",
      };

      const result = await bookingsService.createBooking(bookingDataWithUser);
      setResult(result);
      alert(
        `✅ Booking created successfully!\nBooking ID: ${
          result.bookingId || result.id
        }\nMessage: ${result.message}`
      );
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message);
      alert(`❌ Booking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testApiDirectly = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test with correct backend API format
      const testBooking = {
        guideId: "1",
        touristId: user?.id || "test-tourist",
        date: "2025-08-15", // Tomorrow's date
        timeSlot: "10:00",
        duration: 8,
        numberOfTourists: 2,
        specialRequests: "Test booking from frontend",
        totalPrice: 150,
      };

      console.log("Testing with data:", testBooking);
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("tourconnect_token")}`,
        },
        body: JSON.stringify(testBooking),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        setResult(data);
        alert(
          `✅ Test booking created successfully!\nBooking ID: ${
            data.bookingId
          }\nResponse: ${JSON.stringify(data)}`
        );
      } else {
        setError(
          `API Error (${response.status}): ${
            data.message || "Unknown error"
          }\nFull response: ${JSON.stringify(data)}`
        );
        alert(`❌ API Error: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Direct API test error:", error);
      setError(`Network Error: ${error.message}`);
      alert(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (!user) {
    return (
      <div className="booking-test-page">
        <div className="container">
          <h1>Please Login</h1>
          <p>You need to be logged in as a tourist to test bookings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-test-page">
      <div className="container">
        <h1>🚀 Booking API Test (Tourist Only)</h1>

        <div className="user-info">
          <p>
            <strong>User:</strong> {user.name || user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.userType}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
        </div>

        {user.userType !== "tourist" && (
          <div className="warning">
            ⚠️ Warning: This booking test is designed for tourists only. Current
            user type: {user.userType}
          </div>
        )}

        <div className="test-section">
          <h2>🧪 Quick API Test</h2>
          <p>Test the booking API directly with Swagger format:</p>
          <button
            onClick={testApiDirectly}
            disabled={loading}
            className="btn-test"
          >
            {loading ? "Testing..." : "🔥 Test API Directly"}
          </button>
        </div>

        <div className="form-section">
          <h2>📋 Custom Booking Form</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>Guide ID:</label>
              <input
                type="text"
                value={bookingData.guideId}
                onChange={(e) => handleInputChange("guideId", e.target.value)}
                placeholder="Enter guide ID (e.g., 1, 2, 3)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  min={getMinDate()}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time Slot:</label>
                <select
                  value={bookingData.timeSlot}
                  onChange={(e) =>
                    handleInputChange("timeSlot", e.target.value)
                  }
                >
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Tourists:</label>
                <input
                  type="number"
                  value={bookingData.numberOfTourists}
                  onChange={(e) =>
                    handleInputChange(
                      "numberOfTourists",
                      parseInt(e.target.value)
                    )
                  }
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label>Duration (hours):</label>
                <input
                  type="number"
                  value={bookingData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  min="1"
                  max="24"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Total Price ($):</label>
              <input
                type="number"
                value={bookingData.totalPrice}
                onChange={(e) =>
                  handleInputChange("totalPrice", parseFloat(e.target.value))
                }
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Special Requests:</label>
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                placeholder="Any special requests or notes..."
                rows="3"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Creating Booking..." : "✨ Create Booking"}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-section">
            <h3>❌ Error:</h3>
            <pre>{error}</pre>
          </div>
        )}

        {result && (
          <div className="result-section">
            <h3>✅ Booking Result:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className="debug-section">
          <h3>🔍 Debug Info:</h3>
          <p>
            <strong>Backend URL:</strong> http://localhost:5000/api/bookings
          </p>
          <p>
            <strong>Auth Token:</strong>{" "}
            {localStorage.getItem("tourconnect_token")
              ? "✅ Present"
              : "❌ Missing"}
          </p>
          <p>
            <strong>Current Data:</strong>
          </p>
          <pre>{JSON.stringify(bookingData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default BookingTestPage;
