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
  FaTag
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
                  {tour.category || 'General'}
                </div>
              </div>
              
              <div className="tour-card-content">
                <h3 className="tour-title">{tour.title}</h3>
                <p className="tour-description">
                  {tour.description ? tour.description.substring(0, 100) + '...' : 'No description available'}
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
                      <span>{new Date(tour.tour_date).toLocaleDateString()}</span>
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
          <div className="tour-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTour.title}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-image-section">
                {selectedTour.image_url ? (
                  <img src={selectedTour.image_url} alt={selectedTour.title} />
                ) : (
                  <div className="modal-placeholder">
                    <FaMapMarkerAlt />
                    <p>No image available</p>
                  </div>
                )}
              </div>

              <div className="modal-details-section">
                <div className="detail-grid">
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
                    <div className="detail-value">{selectedTour.duration_hours} hours</div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-header">
                      <FaUsers className="detail-icon-large" />
                      <span className="detail-label">Max People</span>
                    </div>
                    <div className="detail-value">{selectedTour.max_people} people</div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-header">
                      <FaTag className="detail-icon-large" />
                      <span className="detail-label">Category</span>
                    </div>
                    <div className="detail-value">{selectedTour.category || 'General'}</div>
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
                      <div className="detail-value">{selectedTour.tour_time}</div>
                    </div>
                  )}
                </div>

                <div className="description-section">
                  <h3>Description</h3>
                  <p>{selectedTour.description || 'No description available for this tour.'}</p>
                </div>

                <div className="modal-actions">
                  <button className="btn-primary edit-tour-btn">
                    <FaEdit /> Edit Tour
                  </button>
                  <button className="btn-secondary">
                    <FaUsers /> View Bookings
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
