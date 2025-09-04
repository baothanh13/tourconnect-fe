import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toursService } from "../services/toursService";
import { guidesService } from "../services/guidesService";
import Loading from "../components/Loading";
import {
  FaPlus,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaUsers,
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaPause,
  FaPlay,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import "./GuideTours.css";

const GuideTours = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deleting, setDeleting] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Modal handlers
  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTour(null);
  };

  // Helper function to simulate status since database doesn't have status field
  const getSimulatedStatus = (tour) => {
    // For now, all existing tours are considered "active"
    // You could add more logic here based on other fields
    if (tour.price && tour.title && tour.description) {
      return "active";
    }
    return "draft";
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  useEffect(() => {
    loadTours();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterAndSortTours();
  }, [tours, searchTerm, filterStatus, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTours = async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const profile = await guidesService.getGuideByUserId(user.id);
      if (!profile || !profile.id) {
        navigate("/guide/profile/create");
        return;
      }

      // Fetch tours with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 8000)
      );

      const toursPromise = toursService.getToursByGuide(profile.id);
      const response = await Promise.race([toursPromise, timeoutPromise]);

      const toursData = response.tours || response || [];
      setTours(toursData);
    } catch (error) {
      setError(`Failed to load tours: ${error.message}`);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTours = () => {
    let filtered = [...tours];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status - Since database doesn't have status field, we'll simulate it
    if (filterStatus !== "all") {
      filtered = filtered.filter((tour) => {
        // Simulate status based on tour data
        const simulatedStatus = getSimulatedStatus(tour);
        return simulatedStatus === filterStatus;
      });
    }

    // Sort tours
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    setFilteredTours(filtered);
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm("Are you sure you want to delete this tour?")) return;

    try {
      setDeleting(tourId);
      await toursService.deleteTour(tourId);
      setTours(tours.filter((tour) => tour.id !== tourId));
    } catch (error) {
      setError(`Failed to delete tour: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "draft":
        return "secondary";
      default:
        return "success";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="guide-tours-page">
      {/* Header */}
      <div className="tours-header">
        <div className="header-left">
          <button
            className="back-button"
            onClick={() => navigate("/guide/dashboard")}
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1>My Tours</h1>
            <p>Manage your tour offerings and attract more tourists</p>
          </div>
        </div>
        <button
          className="create-tour-btn"
          onClick={() => navigate("/guide/tours/new")}
        >
          <FaPlus />
          <span>Create New Tour</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="tours-controls">
        <div className="search-section">
          <label className="search-label">Search Tours</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search tours by name, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
              title="Filter tours by status: Active (visible to tourists), Paused (hidden temporarily), Draft (not yet published)"
            >
              <option value="all">All Tours</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="sort-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Tours Grid */}
      <div className="tour-content-guide-tours">
        {filteredTours.length > 0 ? (
          <div className="tours-grid">
            {filteredTours.map((tour) => (
              <div key={tour.id} className="tour-card-modern">
                {/* Compact Image Section */}
                <div className="tour-card-image-modern">
                  {tour.image_url ? (
                    <img
                      src={tour.image_url}
                      alt={tour.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.querySelector(
                          ".no-image-placeholder"
                        ).style.display = "flex";
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      <FaMapMarkerAlt />
                    </div>
                  )}
                  <div className="tour-status-badge-modern">
                    {getSimulatedStatus(tour) === "active" ? "Active" : "Draft"}
                  </div>
                </div>

                {/* Compact Content */}
                <div className="tour-card-content-modern">
                  <h3 className="tour-title-modern">{tour.title}</h3>

                  <div className="tour-details-compact">
                    <div className="detail-item-compact">
                      <FaDollarSign className="detail-icon" />
                      <span>${tour.price}</span>
                    </div>
                    <div className="detail-item-compact">
                      <FaClock className="detail-icon" />
                      <span>{tour.duration_hours || 2}h</span>
                    </div>
                    <div className="detail-item-compact">
                      <FaUsers className="detail-icon" />
                      <span>{tour.max_people || 10}</span>
                    </div>
                    <div className="detail-item-compact">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span>{tour.category || "General"}</span>
                    </div>
                  </div>
                </div>

                {/* Compact Footer */}
                <div className="tour-card-footer-modern">
                  <div className="tour-actions-modern">
                    <button
                      className="action-btn-compact view-btn-compact"
                      onClick={() => handleViewDetail(tour)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn-compact edit-btn-compact"
                      onClick={() => navigate(`/guide/tours/${tour.id}/edit`)}
                      title="Edit Tour"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn-compact delete-btn-compact"
                      onClick={() => handleDeleteTour(tour.id)}
                      disabled={deleting === tour.id}
                      title="Delete Tour"
                    >
                      {deleting === tour.id ? (
                        <FaSpinner className="spinner-icon" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>
              {searchTerm || filterStatus !== "all"
                ? "No tours found"
                : "No tours created yet"}
            </h3>
            <p>
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first tour to start attracting tourists"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                className="empty-action-btn"
                onClick={() => navigate("/guide/tours/new")}
              >
                <FaPlus />
                Create Your First Tour
              </button>
            )}
          </div>
        )}
      </div>

      {/* Clean Tour Details Modal */}
      {showModal && selectedTour && (
        <div className="tour-modal-overlay" onClick={handleCloseModal}>
          <div
            className="tour-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-title-section">
                  <h2 className="modal-title">{selectedTour.title}</h2>
                  <span className="tour-category-badge">
                    {selectedTour.category || "General"}
                  </span>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-image-section">
                <img
                  src={selectedTour.image_url || "/api/placeholder/600/300"}
                  alt={selectedTour.title}
                  className="modal-tour-image"
                />
              </div>

              <div className="modal-content-section">
                <div className="tour-description">
                  <h3>Description</h3>
                  <p>
                    {selectedTour.description || "No description available."}
                  </p>
                </div>

                <div className="tour-details-grid">
                  <div className="detail-card">
                    <div className="detail-header">
                      <FaDollarSign className="detail-icon-large" />
                      <span className="detail-label">Price</span>
                    </div>
                    <div className="detail-value">${selectedTour.price}</div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-header">
                      <FaClock className="detail-icon-large" />
                      <span className="detail-label">Duration</span>
                    </div>
                    <div className="detail-value">
                      {selectedTour.duration_hours} hours
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-header">
                      <FaUsers className="detail-icon-large" />
                      <span className="detail-label">Max People</span>
                    </div>
                    <div className="detail-value">
                      {selectedTour.max_people} people
                    </div>
                  </div>

                  {selectedTour.tour_date && (
                    <div className="detail-card">
                      <div className="detail-header">
                        <FaCalendarAlt className="detail-icon-large" />
                        <span className="detail-label">Tour Date</span>
                      </div>
                      <div className="detail-value">
                        {new Date(selectedTour.tour_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {selectedTour.tour_time && (
                    <div className="detail-card">
                      <div className="detail-header">
                        <FaClock className="detail-icon-large" />
                        <span className="detail-label">Tour Time</span>
                      </div>
                      <div className="detail-value">
                        {selectedTour.tour_time
                          ? selectedTour.tour_time.substring(0, 5)
                          : "Not set"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    className="btn-secondary-modern"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    className="btn-primary-modern"
                    onClick={() => {
                      handleCloseModal();
                      navigate(`/guide/tours/${selectedTour.id}/edit`);
                    }}
                  >
                    <FaEdit />
                    Edit Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideTours;
