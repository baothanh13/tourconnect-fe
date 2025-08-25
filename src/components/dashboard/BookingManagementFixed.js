import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import Loading from "../Loading";
import {
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaUsers,
  FaDollarSign,
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaHourglassHalf,
} from "react-icons/fa";
import "./BookingManagement.css";

const BookingManagement = () => {
  const [allBookings, setAllBookings] = useState([]); // Store all bookings
  const [filteredBookings, setFilteredBookings] = useState([]); // Store filtered bookings
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBookings({ limit: 100 });

      // Handle different response formats
      let bookingsData = [];
      if (Array.isArray(data)) {
        bookingsData = data;
      } else if (data.bookings && Array.isArray(data.bookings)) {
        bookingsData = data.bookings;
      } else if (data.data && Array.isArray(data.data)) {
        bookingsData = data.data;
      } else {
        console.warn("Unexpected response format:", data);
        bookingsData = [];
      }

      // Enhance the booking data with better display names
      const enhancedBookings = bookingsData.map((booking) => ({
        ...booking,
        tourist_name:
          booking.tourist_name ||
          `Tourist-${booking.tourist_id?.substring(0, 8) || "Unknown"}`,
        guide_name:
          booking.guide_name ||
          `Guide-${booking.guide_id?.substring(0, 8) || "Unknown"}`,
        tour_name:
          booking.tour_name ||
          booking.tour_title ||
          (booking.special_requests
            ? `Custom Tour (${booking.special_requests.substring(0, 30)}...)`
            : "Tour Experience"),
      }));

      setAllBookings(enhancedBookings);
      setFilteredBookings(enhancedBookings); // Initially show all bookings
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings. Please check your connection.");
      setAllBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter bookings based on status
  const applyStatusFilter = useCallback(
    (status) => {
      if (!status || status === "") {
        setFilteredBookings(allBookings);
      } else {
        const filtered = allBookings.filter(
          (booking) => booking.status?.toLowerCase() === status.toLowerCase()
        );
        setFilteredBookings(filtered);
      }
    },
    [allBookings]
  );

  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    applyStatusFilter(newStatus);
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    applyStatusFilter(statusFilter);
  }, [applyStatusFilter, statusFilter]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "completed":
        return "info";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <FaCheckCircle />;
      case "pending":
        return <FaHourglassHalf />;
      case "cancelled":
        return <FaTimes />;
      case "completed":
        return <FaInfoCircle />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount) || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const time = timeString.split(":");
      const hour = parseInt(time[0]);
      const minute = time[1];
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minute} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  const truncateId = (id) => {
    if (!id) return "N/A";
    return `#${id.substring(0, 8)}...`;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="booking-management">
      <div className="booking-management-header">
        <h2>Booking Management</h2>
        <div className="filters">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <div className="filter-info">
            Showing {filteredBookings.length} of {allBookings.length} bookings
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <FaCalendarAlt size={48} color="#ccc" />
          <p>
            {statusFilter
              ? `No bookings found with status: ${statusFilter}`
              : "No bookings found"}
          </p>
        </div>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Tourist</th>
                <th>Guide</th>
                <th>Tour</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span className="booking-id" title={booking.id}>
                      {truncateId(booking.id)}
                    </span>
                  </td>
                  <td>
                    <div className="user-info">
                      <FaUser className="user-icon" />
                      <span>{booking.tourist_name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-info">
                      <FaUsers className="guide-icon" />
                      <span>{booking.guide_name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="tour-info">
                      <FaMapMarkerAlt className="location-icon" />
                      <span>{booking.tour_name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt className="calendar-icon" />
                      <div>
                        <div>{formatDate(booking.booking_date)}</div>
                        <small className="time-slot">
                          {formatTime(booking.time_slot)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="duration-info">
                      <FaClock className="duration-icon" />
                      <span>{booking.duration_hours}h</span>
                    </div>
                  </td>
                  <td>
                    <div className="guests-info">
                      <FaUsers className="guests-icon" />
                      <span>{booking.number_of_tourists || 1}</span>
                    </div>
                  </td>
                  <td className="amount">
                    <div className="amount-info">
                      <FaDollarSign className="amount-icon" />
                      <span>{formatCurrency(booking.total_price)}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      <span className="status-text">
                        {booking.status?.toUpperCase() || "UNKNOWN"}
                      </span>
                    </span>
                  </td>
                  <td>{formatDate(booking.created_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="btn-view"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="booking-section">
                <h4>
                  <FaInfoCircle /> Basic Information
                </h4>
                <div className="detail-grid">
                  <div className="booking-detail-item">
                    <strong>Booking ID:</strong>
                    <span className="booking-id-full">
                      {selectedBooking.id}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Status:</strong>
                    <span
                      className={`status-badge ${getStatusColor(
                        selectedBooking.status
                      )}`}
                    >
                      {getStatusIcon(selectedBooking.status)}
                      <span>{selectedBooking.status?.toUpperCase()}</span>
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Payment Status:</strong>
                    <span
                      className={`status-badge ${getStatusColor(
                        selectedBooking.payment_status
                      )}`}
                    >
                      {selectedBooking.payment_status?.toUpperCase() || "N/A"}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Created:</strong>
                    <span>{formatDate(selectedBooking.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="booking-section">
                <h4>
                  <FaCalendarAlt /> Schedule Details
                </h4>
                <div className="detail-grid">
                  <div className="booking-detail-item">
                    <strong>Booking Date:</strong>
                    <span>{formatDate(selectedBooking.booking_date)}</span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Time Slot:</strong>
                    <span>{formatTime(selectedBooking.time_slot)}</span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Duration:</strong>
                    <span>{selectedBooking.duration_hours} hours</span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Number of Tourists:</strong>
                    <span>{selectedBooking.number_of_tourists}</span>
                  </div>
                </div>
              </div>

              <div className="booking-section">
                <h4>
                  <FaDollarSign /> Financial Information
                </h4>
                <div className="detail-grid">
                  <div className="booking-detail-item">
                    <strong>Total Price:</strong>
                    <span className="amount-large">
                      {formatCurrency(selectedBooking.total_price)}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Price per Person:</strong>
                    <span>
                      {formatCurrency(
                        parseFloat(selectedBooking.total_price) /
                          selectedBooking.number_of_tourists
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="booking-section">
                <h4>
                  <FaUser /> Participants
                </h4>
                <div className="detail-grid">
                  <div className="booking-detail-item">
                    <strong>Tourist:</strong>
                    <span>{selectedBooking.tourist_name}</span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Guide:</strong>
                    <span>{selectedBooking.guide_name}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div className="booking-section">
                  <h4>
                    <FaExclamationTriangle /> Special Requests
                  </h4>
                  <div className="special-requests">
                    <p>"{selectedBooking.special_requests}"</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
