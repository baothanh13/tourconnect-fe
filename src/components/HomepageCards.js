import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaLanguage,
  FaClock,
} from "react-icons/fa";
import "./HomepageCards.css";

export const GuidePreviewCard = ({ guide }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/guides/${guide.id}`);
  };

  const parseLanguages = (languages) => {
    try {
      if (typeof languages === "string") {
        return JSON.parse(languages).slice(0, 2);
      }
      return Array.isArray(languages) ? languages.slice(0, 2) : [languages];
    } catch {
      return [languages || "English"];
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={i <= numRating ? "star filled" : "star"} />
      );
    }
    return stars;
  };

  return (
    <div className="guide-preview-card" onClick={handleClick}>
      <div className="guide-preview-header">
        <div className="guide-avatar-preview">
          <img
            src={
              guide.avatar_url // ✅ dùng avatar_url từ DB
                ? guide.avatar_url
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    guide.user_name || "Guide"
                  )}&background=0891b2&color=fff&size=60`
            }
            alt={guide.user_name}
          />
        </div>
        {guide.is_available && <div className="available-badge">Available</div>}
      </div>
      <div className="guide-preview-content">
        <h3 className="guide-name-preview">{guide.user_name}</h3>

        <div className="guide-location-preview">
          <FaMapMarkerAlt />
          <span>{guide.location}</span>
        </div>

        <div className="guide-rating">
          <div className="stars">{renderStars(guide.rating)}</div>
          <span className="rating-text">
            {guide.rating || 0} ({guide.total_reviews || 0})
          </span>
        </div>

        <div className="guide-languages">
          <FaLanguage />
          <div className="language-list">
            {parseLanguages(guide.languages).map((lang, idx) => (
              <span key={idx} className="language-tag">
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="guide-price-preview">
          <FaDollarSign />
          <span>${guide.price_per_hour}/hour</span>
        </div>

        <div className="guide-experience">
          {guide.experience_years} years experience
        </div>
      </div>
    </div>
  );
};

export const TourPreviewCard = ({ tour }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tours/${tour.id}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={i <= numRating ? "star filled" : "star"} />
      );
    }
    return stars;
  };

  return (
    <div className="tour-preview-card" onClick={handleClick}>
      <div className="tour-preview-image">
        <img
          src={
            tour.image_url ||
            "https://images.unsplash.com/photo-1539650116574-75c0c6d73273?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          }
          alt={tour.title}
        />
        <div className="tour-price-badge">
          <FaDollarSign />
          <span>${tour.price}</span>
        </div>
      </div>

      <div className="tour-preview-content">
        <div className="tour-category">{tour.category || "Tour"}</div>
        <h3 className="tour-title">{tour.title}</h3>

        <div className="tour-meta">
          <div className="meta-item">
            <FaClock />
            <span>{tour.duration_hours || 4}h</span>
          </div>
          <div className="meta-item">
            <FaMapMarkerAlt />
            <span>{tour.location}</span>
          </div>
        </div>

        <div className="tour-rating">
          <div className="stars">{renderStars(tour.rating)}</div>
          <span className="rating-text">
            ({tour.total_bookings || 0} bookings)
          </span>
        </div>

        <div className="tour-guide">By {tour.guide_name || "Local Guide"}</div>
      </div>
    </div>
  );
};

export const StatCard = ({ icon, value, label, trend }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && <div className="stat-trend">+{trend}% this month</div>}
    </div>
  </div>
);

export const BookingActivityCard = ({ booking }) => (
  <div className="booking-activity-card">
    <div className="booking-info">
      <div className="tourist-name">
        {booking.tourist_name || "Anonymous Traveler"}
      </div>
      <div className="booking-details">
        booked <strong>{booking.tour_name || "a tour"}</strong> with{" "}
        <strong>{booking.guide_name || "a guide"}</strong>
      </div>
      <div className="booking-time">
        {new Date(booking.created_at).toLocaleDateString()}
      </div>
    </div>
    <div className="booking-status">
      <span className={`status-badge ${booking.status}`}>
        {booking.status || "confirmed"}
      </span>
    </div>
  </div>
);
