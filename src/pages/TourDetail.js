import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toursService } from "../services/toursService";
import Loading from "../components/Loading";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaUsers,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import "./TourDetail.css";

const TourDetail = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTour();
  }, [tourId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTour = async () => {
    try {
      setLoading(true);
      setError(null);

      const tourData = await toursService.getTourById(tourId);
      setTour(tourData);
    } catch (error) {
      setError(error.message || "Failed to load tour details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="tour-detail-container">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/guide/tours")}>
            <FaArrowLeft /> Back to Tours
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tour-detail-container">
        <div className="error-state">
          <h2>Tour Not Found</h2>
          <p>The tour you're looking for doesn't exist.</p>
          <button onClick={() => navigate("/guide/tours")}>
            <FaArrowLeft /> Back to Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-detail-container">
      <div className="tour-detail-header">
        <button className="back-btn" onClick={() => navigate("/guide/tours")}>
          <FaArrowLeft /> Back to Tours
        </button>
        <button
          className="edit-btn"
          onClick={() => navigate(`/guide/tours/${tour.id}/edit`)}
        >
          <FaEdit /> Edit Tour
        </button>
      </div>

      <div className="tour-detail-content">
        <div className="tour-image-section">
          {tour.image_url ? (
            <img
              src={tour.image_url}
              alt={tour.title}
              className="tour-main-image"
              onError={(e) => {
                e.target.style.display = "none";
                document.querySelector(".no-image-placeholder").style.display =
                  "flex";
              }}
            />
          ) : null}
          <div
            className="no-image-placeholder"
            style={{ display: tour.image_url ? "none" : "flex" }}
          >
            <FaMapMarkerAlt />
            <span>No Image Available</span>
          </div>
        </div>

        <div className="tour-info-section">
          <div className="tour-header">
            <h1>{tour.title}</h1>
            <div className="tour-category">
              {tour.category && (
                <span className="category-badge">
                  {tour.category.charAt(0).toUpperCase() +
                    tour.category.slice(1)}
                </span>
              )}
            </div>
          </div>

          <div className="tour-details-grid">
            <div className="detail-card">
              <FaDollarSign />
              <div>
                <span className="label">Price</span>
                <span className="value">${tour.price || 0}</span>
              </div>
            </div>

            <div className="detail-card">
              <FaClock />
              <div>
                <span className="label">Duration</span>
                <span className="value">{tour.duration_hours || 2} hours</span>
              </div>
            </div>

            <div className="detail-card">
              <FaUsers />
              <div>
                <span className="label">Max Participants</span>
                <span className="value">{tour.max_people || 10} people</span>
              </div>
            </div>

            <div className="detail-card">
              <FaCalendarAlt />
              <div>
                <span className="label">Created</span>
                <span className="value">
                  {new Date(tour.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="tour-description">
            <h3>Description</h3>
            <p>{tour.description || "No description available."}</p>
          </div>

          <div className="tour-actions">
            <button
              className="btn-primary"
              onClick={() => navigate(`/guide/tours/${tour.id}/edit`)}
            >
              <FaEdit /> Edit Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
