import React from "react";
import { Link } from "react-router-dom";
import "./GuideCard.css";

const GuideCard = ({ guide }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="guide-card">
      <div className="guide-card-header">
        <div className="guide-avatar">
          <img src={guide.avatar} alt={guide.name} />
          {guide.isVerified && (
            <div className="verified-badge" title="Verified Guide">
              ✓
            </div>
          )}
        </div>

        <div className="guide-basic-info">
          <h3 className="guide-name">{guide.name}</h3>
          <p className="guide-location">📍 {guide.location}</p>

          <div className="guide-rating">
            <div className="stars">{renderStars(guide.rating)}</div>
            <span className="rating-text">
              {guide.rating} ({guide.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="guide-price">
          <span className="price-amount">${guide.pricePerHour}</span>
          <span className="price-unit">/ hour</span>
        </div>
      </div>

      <div className="guide-card-body">
        <p className="guide-description">{guide.description}</p>

        <div className="guide-specialties">
          {guide.specialties.slice(0, 3).map((specialty, index) => (
            <span key={index} className="specialty-tag">
              {specialty}
            </span>
          ))}
          {guide.specialties.length > 3 && (
            <span className="specialty-tag more">
              +{guide.specialties.length - 3} more
            </span>
          )}
        </div>

        <div className="guide-languages">
          <span className="languages-label">Languages:</span>
          <span className="languages-list">{guide.languages.join(", ")}</span>
        </div>

        <div className="guide-stats">
          <div className="stat">
            <span className="stat-value">{guide.totalTours}</span>
            <span className="stat-label">Tours</span>
          </div>
          <div className="stat">
            <span className="stat-value">{guide.yearsExperience}</span>
            <span className="stat-label">Years</span>
          </div>
        </div>
      </div>

      <div className="guide-card-footer">
        <Link to={`/guides/${guide.id}`} className="btn-view-profile">
          View Profile
        </Link>
        <button className="btn-message">Message</button>
      </div>
    </div>
  );
};

export default GuideCard;
