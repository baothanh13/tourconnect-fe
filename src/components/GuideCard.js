import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./GuideCard.css";

const GuideCard = ({ guide }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const renderStars = (rating) => {
    // Convert rating to number and handle invalid values
    const numRating = parseFloat(rating);
    if (!rating || isNaN(numRating) || numRating <= 0) {
      return <span className="no-rating">No rating yet</span>;
    }

    const stars = [];
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(numRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return "English";
    if (Array.isArray(languages)) {
      return (
        languages.slice(0, 2).join(", ") +
        (languages.length > 2 ? `, +${languages.length - 2}` : "")
      );
    }
    return languages;
  };

  const formatSpecialties = (specialties) => {
    if (!specialties || specialties.length === 0) return ["Cultural Tours"];
    if (Array.isArray(specialties)) {
      return specialties.slice(0, 3);
    }
    return [specialties];
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    // TODO: Add API call to save/remove favorite
  };

  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate(`/booking/${guide.id}`);
    }
  };

  return (
    <div className="modern-guide-card">
      {/* Favorite button */}
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={handleFavoriteClick}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? "#ff4757" : "none"}
          stroke="currentColor"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Guide Avatar and Status */}
      <div className="guide-avatar-section">
        <div className="guide-avatar-container">
          {guide.avatar_url ? (
            <img
              src={guide.avatar_url}
              alt={guide.user_name}
              className="guide-avatar-img"
            />
          ) : (
            <div className="guide-avatar-placeholder">
              {guide.user_name?.charAt(0)?.toUpperCase() || "G"}
            </div>
          )}

          {/* Online status indicator */}
          {guide.is_available && (
            <div className="online-indicator">
              <span className="pulse-dot"></span>
            </div>
          )}
        </div>

        {/* Verification badges */}
        <div className="verification-badges">
          {guide.verification_status === "verified" && (
            <span className="badge verified">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z" />
              </svg>
              Verified
            </span>
          )}
          {guide.certificates && guide.certificates.length > 0 && (
            <span className="badge certified">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Certified
            </span>
          )}
        </div>
      </div>

      {/* Guide Info */}
      <div className="guide-info-section">
        <div className="guide-header">
          <h3 className="guide-name">{guide.user_name}</h3>
          <div className="guide-location">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{guide.location}</span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="rating-section">
          <div className="stars-container">
            {renderStars(guide.rating)}
            <span className="rating-value">
              {guide.rating && !isNaN(parseFloat(guide.rating))
                ? parseFloat(guide.rating).toFixed(1)
                : "5.0"}
            </span>
          </div>
          <span className="review-count">
            ({guide.total_reviews || 0} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="guide-description">
          {guide.description
            ? guide.description.length > 120
              ? guide.description.substring(0, 120) + "..."
              : guide.description
            : "Professional local guide ready to show you the best experiences in the area with personalized tours."}
        </p>

        {/* Specialties */}
        <div className="specialties-section">
          {formatSpecialties(guide.specialties).map((specialty, index) => (
            <span key={index} className="specialty-chip">
              {specialty}
            </span>
          ))}
        </div>

        {/* Guide Details Grid */}
        <div className="guide-details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5zm2 0v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
              </svg>
            </div>
            <div className="detail-content">
              <span className="detail-label">Languages</span>
              <span className="detail-value">
                {formatLanguages(guide.languages)}
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="detail-content">
              <span className="detail-label">Experience</span>
              <span className="detail-value">
                {guide.experience_years || 2}+ years
              </span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="detail-content">
              <span className="detail-label">Response Rate</span>
              <span className="detail-value">98%</span>
            </div>
          </div>
        </div>

        {/* Price and Availability */}
        <div className="price-availability-section">
          <div className="price-container">
            <span className="price-amount-card">${guide.price_per_hour}</span>
            <span className="price-unit">/hour</span>
          </div>
          <div className="availability-container">
            {guide.is_available ? (
              <span className="availability available">
                <span className="status-dot available"></span>
                Available Now
              </span>
            ) : (
              <span className="availability busy">
                <span className="status-dot busy"></span>
                Busy
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to={`/guides/${guide.id}`} className="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            View Profile
          </Link>

          <button
            className="btn btn-book"
            onClick={handleBookNowClick}
            title={
              isAuthenticated
                ? "Book this guide now"
                : "Login to book this guide"
            }
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
            </svg>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
