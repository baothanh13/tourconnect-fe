import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import touristService from "../../services/touristService";
import Loading from "../Loading";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaEye,
  FaEdit,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";
import "./TouristBookings.css";

const TouristBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const bookingsData = await touristService.getTouristBookings(user.id);
      setBookings(bookingsData);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await touristService.cancelBooking(bookingId);
      await loadBookings(); // Refresh bookings
      alert("Booking cancelled successfully!");
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle className="status-icon confirmed" />;
      case "pending":
        return <FaClock className="status-icon pending" />;
      case "cancelled":
        return <FaTimes className="status-icon cancelled" />;
      case "completed":
        return <FaCheckCircle className="status-icon completed" />;
      default:
        return <FaExclamationTriangle className="status-icon unknown" />;
    }
  };

  const getStatusClass = (status) => {
    return `booking-status ${status}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch =
      booking.tourTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guideName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <Loading />;

  return (
    <div className="tourist-bookings">
      {/* Header with back button and title */}
      <div className="page-header">
        <button
          className="back-button"
          onClick={() => navigate("/tourist/dashboard")}
        >
          <FaArrowLeft />
        </button>
        <div className="page-title-center">
          <h2>My Bookings</h2>
          <p>Manage your booking requests and tour schedules</p>
        </div>
      </div>

      {/* Statistics Cards - 2x2 Grid */}
      <div className="booking-stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">TOTAL BOOKINGS</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="stat-label">PENDING</div>
          </div>
        </div>

        <div className="stat-card confirmed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
            <div className="stat-label">CONFIRMED</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <FaUser />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
            <div className="stat-label">COMPLETED</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h3>SEARCH BOOKINGS</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by tourist name, booking ID, or tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>FILTER STATUS</h3>
        <div className="filter-tabs">
          <button
            className={filterStatus === "all" ? "active" : ""}
            onClick={() => setFilterStatus("all")}
          >
            All Bookings
          </button>
          <button
            className={filterStatus === "pending" ? "active" : ""}
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </button>
          <button
            className={filterStatus === "confirmed" ? "active" : ""}
            onClick={() => setFilterStatus("confirmed")}
          >
            Confirmed
          </button>
          <button
            className={filterStatus === "completed" ? "active" : ""}
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </button>
          <button
            className={filterStatus === "cancelled" ? "active" : ""}
            onClick={() => setFilterStatus("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button onClick={loadBookings}>Retry</button>
        </div>
      )}

      {/* Bookings Grid */}
      <div className="bookings-grid">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <FaCalendarAlt className="no-bookings-icon" />
            <h3>No bookings found</h3>
            <p>
              {searchQuery || filterStatus !== "all"
                ? "No bookings match your current filters."
                : "You haven't made any bookings yet."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className={getStatusClass(booking.status)}>
                  {getStatusIcon(booking.status)}
                  <span className="status-text">{booking.status}</span>
                </div>
                <div className="booking-price">
                  {formatCurrency(booking.total_price)}
                </div>
              </div>

              <div className="booking-content">
                <h3 className="tour-title">{booking.tourTitle}</h3>

                <div className="booking-details">
                  <div className="detail-item">
                    <FaUser className="detail-icon" />
                    <span>{booking.guideName}</span>
                  </div>

                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <span>{formatDate(booking.booking_date)}</span>
                  </div>

                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{booking.location}</span>
                  </div>

                  {booking.time && (
                    <div className="detail-item">
                      <FaClock className="detail-icon" />
                      <span>{booking.time}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="booking-actions">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetails(true);
                  }}
                >
                  <FaEye /> View Details
                </button>

                {booking.status === "confirmed" && (
                  <button
                    className="btn-danger"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    <FaTimes /> Cancel
                  </button>
                )}

                {booking.status === "pending" && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      // Navigate to edit booking
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetails(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="booking-detail-section">
                <h4>Tour Information</h4>
                <p>
                  <strong>Tour:</strong> {selectedBooking.tourTitle}
                </p>
                <p>
                  <strong>Guide:</strong> {selectedBooking.guideName}
                </p>
                <p>
                  <strong>Location:</strong> {selectedBooking.location}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(selectedBooking.booking_date)}
                </p>
                {selectedBooking.time && (
                  <p>
                    <strong>Time:</strong> {selectedBooking.time}
                  </p>
                )}
              </div>

              <div className="booking-detail-section">
                <h4>Booking Information</h4>
                <p>
                  <strong>Status:</strong> {selectedBooking.status}
                </p>
                <p>
                  <strong>Total Price:</strong>{" "}
                  {formatCurrency(selectedBooking.total_price)}
                </p>
                <p>
                  <strong>Participants:</strong>{" "}
                  {selectedBooking.numberOfTourists || 1}
                </p>
                {selectedBooking.specialRequests && (
                  <p>
                    <strong>Special Requests:</strong>{" "}
                    {selectedBooking.specialRequests}
                  </p>
                )}
              </div>

              <div className="booking-detail-section">
                <h4>Booking Timeline</h4>
                <p>
                  <strong>Booked on:</strong>{" "}
                  {formatDate(selectedBooking.created_at)}
                </p>
                {selectedBooking.updated_at && (
                  <p>
                    <strong>Last updated:</strong>{" "}
                    {formatDate(selectedBooking.updated_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristBookings;
