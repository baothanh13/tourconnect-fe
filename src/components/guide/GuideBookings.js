import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { bookingsService } from "../../services/bookingsService";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaDollarSign,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import "./GuideBookings.css";

const GuideBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [guideProfile, setGuideProfile] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const profile = await guidesService.getGuideByUserId(user.id);
        setGuideProfile(profile);

        if (profile?.id) {
          const bookingsData = await bookingsService.getGuideBookings(
            profile.id,
            { limit: 100 }
          );

          const bookingsArray = bookingsData.bookings || [];
          setBookings(bookingsArray);
          setFilteredBookings(bookingsArray);

          // Calculate stats
          const newStats = {
            total: bookingsArray.length,
            pending: bookingsArray.filter(
              (b) => b.status?.toLowerCase() === "pending"
            ).length,
            confirmed: bookingsArray.filter(
              (b) => b.status?.toLowerCase() === "confirmed"
            ).length,
            completed: bookingsArray.filter(
              (b) => b.status?.toLowerCase() === "completed"
            ).length,
            cancelled: bookingsArray.filter(
              (b) => b.status?.toLowerCase() === "cancelled"
            ).length,
          };
          setStats(newStats);
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter bookings based on status and search term
  useEffect(() => {
    let filtered = bookings;

    if (statusFilter) {
      filtered = filtered.filter(
        (booking) =>
          booking.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.tourist_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.tour_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, searchTerm]);

  const handleStatusUpdate = async (
    bookingId,
    newStatus,
    responseMessage = ""
  ) => {
    try {
      setActionLoading(bookingId);
      await bookingsService.updateBookingStatus(
        bookingId,
        newStatus,
        responseMessage
      );

      // Refresh bookings
      await fetchBookings();

      // Close modal if open
      if (showModal && selectedBooking?.id === bookingId) {
        setShowModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert(error.message || "Failed to update booking status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewBooking = async (booking) => {
    try {
      // Fetch detailed booking information
      const detailedBooking = await bookingsService.getBookingById(booking.id);
      setSelectedBooking(detailedBooking.booking || booking);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setSelectedBooking(booking);
      setShowModal(true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <FaCheckCircle />;
      case "pending":
        return <FaHourglassHalf />;
      case "cancelled":
        return <FaTimesCircle />;
      case "completed":
        return <FaStar />;
      default:
        return <FaInfoCircle />;
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const truncateId = (id) => {
    if (!id) return "N/A";
    return id.length > 8 ? `${id.substring(0, 8)}...` : id;
  };

  if (loading) return <Loading />;

  return (
    <div className="guide-bookings-page">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate("/guide/dashboard")}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1>My Bookings</h1>
            <p>Manage your booking requests and tour schedules</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">
            <FaHourglassHalf />
          </div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card confirmed">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.confirmed}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bookings-controls-guide">
        <div className="search-section">
          <label className="search-label">Search Bookings</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by tourist name, booking ID, or tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section-guide">
          <div className="filter-group">
            <label>Filter Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="filter-info">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt size={48} color="#ccc" />
          <h3>
            {statusFilter
              ? `No bookings found with status: ${statusFilter}`
              : searchTerm
              ? "No bookings match your search"
              : "No bookings yet"}
          </h3>
          <p>
            {!statusFilter && !searchTerm
              ? "Start promoting your tours to get booked!"
              : "Try adjusting your filters or search term"}
          </p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Tourist</th>
                <th>Tour</th>
                <th>Date & Time</th>
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
                      <span>{booking.tourist_name || "Tourist"}</span>
                    </div>
                  </td>
                  <td>
                    <div className="tour-info">
                      <FaMapMarkerAlt className="location-icon" />
                      <span>
                        {booking.tour_title ||
                          booking.tour_name ||
                          "Tour Experience"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt className="calendar-icon" />
                      <div>
                        <div>
                          {formatDate(booking.booking_date || booking.date)}
                        </div>
                        <small className="time-slot">
                          {formatTime(booking.time_slot || booking.time)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="duration-info">
                      <FaClock className="duration-icon" />
                      <span>
                        {booking.duration_hours || booking.duration || 0}h
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="guests-info">
                      <FaUsers className="guests-icon" />
                      <span>
                        {booking.number_of_tourists ||
                          booking.numberOfTourists ||
                          1}
                      </span>
                    </div>
                  </td>
                  <td className="amount">
                    <div className="amount-info">
                      <FaDollarSign className="amount-icon" />
                      <span>
                        {formatCurrency(
                          booking.total_price || booking.totalPrice
                        )}
                      </span>
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
                        disabled={actionLoading === booking.id}
                      >
                        {actionLoading === booking.id ? (
                          <FaSpinner className="spinner" />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                      {booking.status?.toLowerCase() === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                            className="btn-confirm"
                            title="Confirm Booking"
                            disabled={actionLoading === booking.id}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                booking.id,
                                "cancelled",
                                "Declined by guide"
                              )
                            }
                            className="btn-decline"
                            title="Decline Booking"
                            disabled={actionLoading === booking.id}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
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
              <h3>
                <FaInfoCircle /> Booking Details
              </h3>
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
                  <FaUser /> Tourist Information
                </h4>
                <div className="detail-grid">
                  <div className="booking-detail-item">
                    <strong>Name:</strong>
                    <span>{selectedBooking.tourist_name || "N/A"}</span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Email:</strong>
                    <span>
                      {selectedBooking.tourist_email ? (
                        <a href={`mailto:${selectedBooking.tourist_email}`}>
                          <FaEnvelope /> {selectedBooking.tourist_email}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Phone:</strong>
                    <span>
                      {selectedBooking.tourist_phone ? (
                        <a href={`tel:${selectedBooking.tourist_phone}`}>
                          <FaPhone /> {selectedBooking.tourist_phone}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
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
                    <span>
                      {formatDate(
                        selectedBooking.booking_date || selectedBooking.date
                      )}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Time Slot:</strong>
                    <span>
                      {formatTime(
                        selectedBooking.time_slot || selectedBooking.time
                      )}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Duration:</strong>
                    <span>
                      {selectedBooking.duration_hours ||
                        selectedBooking.duration ||
                        0}{" "}
                      hours
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Number of Tourists:</strong>
                    <span>
                      {selectedBooking.number_of_tourists ||
                        selectedBooking.numberOfTourists ||
                        1}
                    </span>
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
                    <span className="price-highlight">
                      {formatCurrency(
                        selectedBooking.total_price ||
                          selectedBooking.totalPrice
                      )}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <strong>Payment Method:</strong>
                    <span>{selectedBooking.payment_method || "N/A"}</span>
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

              {selectedBooking.status?.toLowerCase() === "pending" && (
                <div className="booking-actions-section">
                  <h4>Actions</h4>
                  <div className="action-buttons-modal">
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedBooking.id, "confirmed")
                      }
                      className="btn-confirm-modal"
                      disabled={actionLoading === selectedBooking.id}
                    >
                      {actionLoading === selectedBooking.id ? (
                        <FaSpinner className="spinner" />
                      ) : (
                        <FaCheck />
                      )}
                      Confirm Booking
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          selectedBooking.id,
                          "cancelled",
                          "Declined by guide"
                        )
                      }
                      className="btn-decline-modal"
                      disabled={actionLoading === selectedBooking.id}
                    >
                      {actionLoading === selectedBooking.id ? (
                        <FaSpinner className="spinner" />
                      ) : (
                        <FaTimes />
                      )}
                      Decline Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideBookings;
