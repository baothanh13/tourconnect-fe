import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TourCard.css";

const TourCard = ({ tour }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getPriceCategory = (price) => {
    if (price >= 200) return "premium";
    if (price >= 100) return "standard";
    return "budget";
  };

  const getPriceIcon = (price) => {
    const category = getPriceCategory(price);
    switch (category) {
      case "premium":
        return "💎";
      case "standard":
        return "⭐";
      case "budget":
        return "💰";
      default:
        return "💰";
    }
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours === 1) return "1h";
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days}d`;
    return `${days}d ${remainingHours}h`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: "🍜",
      cultural: "🏛️",
      nature: "🌿",
      adventure: "🏔️",
      historical: "🏺",
      art: "🎨",
      nightlife: "🌃",
      city: "🏙️",
      beach: "🏖️",
      hiking: "🥾",
      photography: "📸",
    };
    return icons[category?.toLowerCase()] || "🎯";
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;

    return (
      <div className="tour-rating">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`star ${
                i < fullStars
                  ? "filled"
                  : i === fullStars && hasHalfStar
                  ? "half"
                  : ""
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
        <span className="rating-text">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";

  return (
    <div className="modern-tour-card">
      {/* Image Section */}
      <div className="tour-image-wrapper">
        <img
          src={imageError ? defaultImage : tour.image_url || defaultImage}
          alt={tour.title}
          className="tour-main-image"
          onError={() => setImageError(true)}
        />

        {/* Overlay Elements */}
        <div className="image-overlay">
          {/* Category Badge */}
          <div className="category-tag">
            <span className="category-icon">
              {getCategoryIcon(tour.category)}
            </span>
            <span>{tour.category || "Tour"}</span>
          </div>

          {/* Like Button */}
          <button
            className={`like-btn ${isLiked ? "liked" : ""}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <span className="heart-icon">{isLiked ? "❤️" : "🤍"}</span>
          </button>
        </div>

        {/* Price Badge */}
        <div className={`price-tag ${getPriceCategory(tour.price)}`}>
          <div className="price-header">
            <span className="price-icon">{getPriceIcon(tour.price)}</span>
          </div>
          <span className="price-value">{formatPrice(tour.price)}</span>
          <span className="price-unit">per person</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="tour-card-content">
        {/* Header */}
        <div className="tour-header">
          <h3 className="tour-title">{tour.title}</h3>
          {tour.rating && renderStars(tour.rating)}
        </div>

        {/* Tour Info */}
        <div className="tour-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-text">
              {formatDuration(tour.duration_hours)}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span className="meta-text">Up to {tour.max_people}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span className="meta-text">{tour.location || "Vietnam"}</span>
          </div>
        </div>

        {/* Description */}
        <p className="tour-description">
          {tour.description?.length > 100
            ? `${tour.description.substring(0, 100)}...`
            : tour.description ||
              "Experience an amazing adventure with professional guides."}
        </p>

        {/* Guide Section */}
        {tour.guide_name && (
          <div className="tour-guide">
            <div className="guide-avatar">
              <img
                src={
                  tour.guide_avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    tour.guide_name
                  )}&background=667eea&color=fff&size=40`
                }
                alt={tour.guide_name}
              />
            </div>
            <div className="guide-info">
              <span className="guide-label">Tour Guide</span>
              <span className="guide-name">{tour.guide_name}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="tour-actions">
          <Link
            to={`/tours/${tour.id}`}
            className="btn-primary tour-details-btn"
          >
            <span className="btn-icon">👁️</span>
            View Details
          </Link>

          <button className="btn-secondary book-now-btn">
            <span className="btn-icon">📅</span>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
