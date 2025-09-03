import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toursService } from "../../services/toursService";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaClock,
  FaUsers,
  FaDollarSign,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";
import "./GuideComponents.css";

const GuideTours = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTour(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const profile = await guidesService.getGuideByUserId(user.id);

          if (profile?.id) {
            const toursData = await toursService.getToursByGuide(profile.id);
            setTours(toursData.tours || []);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="guide-tours">
      <div className="page-header">
        <h1>My Tours</h1>
        <button className="btn-primary">
          <FaPlus /> Create New Tour
        </button>
      </div>

      {tours.length > 0 ? (
        <div className="tours-grid">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card-modern">
              <div className="tour-card-header">
                <div className="tour-image-placeholder">
                  {tour.image_url ? (
                    <img src={tour.image_url} alt={tour.title} />
                  ) : (
                    <div className="placeholder-icon">
                      <FaMapMarkerAlt />
                    </div>
                  )}
                </div>
                <div className="tour-badge">
                  <FaTag />
                  {tour.category || "General"}
                </div>
              </div>

              <div className="tour-card-content">
                <h3 className="tour-title">{tour.title}</h3>
                <p className="tour-description">
                  {tour.description
                    ? tour.description.substring(0, 100) + "..."
                    : "No description available"}
                </p>

                <div className="tour-details">
                  <div className="detail-item">
                    <FaDollarSign className="detail-icon" />
                    <span>${tour.price}</span>
                  </div>
                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <span>{tour.duration_hours}h</span>
                  </div>
                  <div className="detail-item">
                    <FaUsers className="detail-icon" />
                    <span>{tour.max_people} max</span>
                  </div>
                  {tour.tour_date && (
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>
                        {new Date(tour.tour_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="tour-card-actions">
                <button
                  className="btn-icon view-btn"
                  onClick={() => handleViewDetail(tour)}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button className="btn-icon edit-btn" title="Edit Tour">
                  <FaEdit />
                </button>
                <button className="btn-icon delete-btn" title="Delete Tour">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't created any tours yet.</p>
          <button className="btn-primary">Create Your First Tour</button>
        </div>
      )}

      {/* Tour Detail Modal */}
      {showModal && selectedTour && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="tour-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedTour.title}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-content">
              {/* Tour Image Section */}
              <div className="tour-image-container">
                {selectedTour.image_url ? (
                  <img
                    src={selectedTour.image_url}
                    alt={selectedTour.title}
                    className="tour-detail-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    <FaMapMarkerAlt className="placeholder-icon" />
                    <span>No image available</span>
                  </div>
                )}
                <div className="image-overlay">
                  <div className="tour-category-badge">
                    <FaTag />
                    {selectedTour.category || "General"}
                  </div>
                </div>
              </div>

              {/* Tour Information */}
              <div className="tour-info-section">
                <div className="tour-title-section">
                  <h2 className="tour-title">{selectedTour.title}</h2>
                  <div className="tour-location">
                    <FaMapMarkerAlt className="location-icon" />
                    <span>
                      {selectedTour.location || "Location not specified"}
                    </span>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="quick-info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <FaDollarSign />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Price</span>
                      <span className="info-value">${selectedTour.price}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaClock />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Duration</span>
                      <span className="info-value">
                        {selectedTour.duration_hours} hours
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaUsers />
                    </div>
                    <div className="info-content">
                      <span className="info-label">Max Guests</span>
                      <span className="info-value">
                        {selectedTour.max_people} people
                      </span>
                    </div>
                  </div>

                  {selectedTour.tour_date && (
                    <div className="info-item">
                      <div className="info-icon">
                        <FaCalendarAlt />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Date</span>
                        <span className="info-value">
                          {new Date(
                            selectedTour.tour_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTour.tour_time && (
                    <div className="info-item">
                      <div className="info-icon">
                        <FaClock />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Time</span>
                        <span className="info-value">
                          {selectedTour.tour_time}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="tour-description">
                  <h3>About this tour</h3>
                  <p>
                    {selectedTour.description ||
                      "No description available for this tour."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="tour-actions">
                  <button className="action-btn primary">
                    <FaEdit />
                    Edit Tour
                  </button>
                  <button className="action-btn secondary">
                    <FaUsers />
                    View Bookings
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
