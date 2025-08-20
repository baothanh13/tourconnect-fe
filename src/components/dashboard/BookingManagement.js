import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import Loading from "../Loading";
import { FaEye, FaCalendarAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import "./BookingManagement.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
    limit: 10,
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBookings(filters);
      setBookings(data.bookings || data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
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
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

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
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>
                      {booking.tourist_name || booking.user_name || "N/A"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <FaUser className="guide-icon" />
                    <span>{booking.guide_name || "N/A"}</span>
                  </div>
                </td>
                <td>
                  <div className="tour-info">
                    <FaMapMarkerAlt className="location-icon" />
                    <span>
                      {booking.tour_title || booking.tour_name || "N/A"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <FaCalendarAlt className="calendar-icon" />
                    <span>
                      {booking.tour_date
                        ? new Date(booking.tour_date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td>{booking.duration || "N/A"}</td>
                <td>{booking.number_of_guests || booking.guests || 1}</td>
                <td className="amount">
                  {formatCurrency(booking.total_amount || booking.amount)}
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(booking.status)}`}
                  >
                    {booking.status || "Unknown"}
                  </span>
                </td>
                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
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

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Booking Details - #{selectedBooking.id}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="booking-section">
                <h4>Booking Information</h4>
                <div className="booking-detail-item">
                  <strong>Booking ID:</strong> #{selectedBooking.id}
                </div>
                <div className="booking-detail-item">
                  <strong>Status:</strong>
                  <span
                    className={`status-badge ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
                <div className="booking-detail-item">
                  <strong>Tour Date:</strong>{" "}
                  {selectedBooking.tour_date
                    ? new Date(selectedBooking.tour_date).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Duration:</strong> {selectedBooking.duration || "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Number of Guests:</strong>{" "}
                  {selectedBooking.number_of_guests ||
                    selectedBooking.guests ||
                    1}
                </div>
                <div className="booking-detail-item">
                  <strong>Total Amount:</strong>{" "}
                  {formatCurrency(
                    selectedBooking.total_amount || selectedBooking.amount
                  )}
                </div>
              </div>

              <div className="booking-section">
                <h4>Tourist Information</h4>
                <div className="booking-detail-item">
                  <strong>Name:</strong>{" "}
                  {selectedBooking.tourist_name ||
                    selectedBooking.user_name ||
                    "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Email:</strong>{" "}
                  {selectedBooking.tourist_email ||
                    selectedBooking.user_email ||
                    "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Phone:</strong>{" "}
                  {selectedBooking.tourist_phone ||
                    selectedBooking.phone ||
                    "N/A"}
                </div>
              </div>

              <div className="booking-section">
                <h4>Guide Information</h4>
                <div className="booking-detail-item">
                  <strong>Guide Name:</strong>{" "}
                  {selectedBooking.guide_name || "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Guide Email:</strong>{" "}
                  {selectedBooking.guide_email || "N/A"}
                </div>
              </div>

              <div className="booking-section">
                <h4>Tour Information</h4>
                <div className="booking-detail-item">
                  <strong>Tour Title:</strong>{" "}
                  {selectedBooking.tour_title ||
                    selectedBooking.tour_name ||
                    "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Location:</strong>{" "}
                  {selectedBooking.location ||
                    selectedBooking.tour_location ||
                    "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Description:</strong>{" "}
                  {selectedBooking.tour_description ||
                    selectedBooking.description ||
                    "N/A"}
                </div>
              </div>

              <div className="booking-section">
                <h4>Additional Details</h4>
                <div className="booking-detail-item">
                  <strong>Special Requests:</strong>{" "}
                  {selectedBooking.special_requests || "None"}
                </div>
                <div className="booking-detail-item">
                  <strong>Payment Status:</strong>{" "}
                  {selectedBooking.payment_status || "N/A"}
                </div>
                <div className="booking-detail-item">
                  <strong>Created:</strong>{" "}
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </div>
                <div className="booking-detail-item">
                  <strong>Last Updated:</strong>{" "}
                  {selectedBooking.updated_at
                    ? new Date(selectedBooking.updated_at).toLocaleString()
                    : "N/A"}
                </div>
              </div>
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
