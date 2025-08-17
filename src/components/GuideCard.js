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
        </div>
        <div className="guide-basic-info">
          <div className="guide-name-row">
            <h3 className="guide-name">{guide.name}</h3>
            {guide.isVerified && (
              <span className="verified-badge" title="Verified Guide">
                ✓
              </span>
            )}
          </div>
          <div className="guide-meta">
            <span className="guide-location">📍 {guide.location}</span>
            <span className="guide-rating">
              ⭐ {guide.rating}{" "}
              <span className="review-count">({guide.reviewCount})</span>
            </span>
          </div>
        </div>
        <div className="guide-price-badge">
          ${guide.pricePerHour}
          <span>/hr</span>
        </div>
      </div>

      <div className="guide-card-body">
        <p className="guide-description">{guide.description}</p>

        <div className="guide-specialties">
          {guide.specialties.slice(0, 3).map((specialty, i) => (
            <span key={i} className="specialty-tag">
              {specialty}
            </span>
          ))}
          {guide.specialties.length > 3 && (
            <span className="specialty-tag more">
              +{guide.specialties.length - 3} more
            </span>
          )}
        </div>

        <div className="guide-info-line">
          <span>
            <strong>Languages:</strong> {guide.languages.join(", ")}
          </span>
          <span>· {guide.totalTours} Tours</span>
          <span>· {guide.yearsExperience} Years</span>
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
