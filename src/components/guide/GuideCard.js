import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const GuideCard = ({ guide }) => {
  const { user } = useAuth();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Please login to book a tour");
      return;
    }

    if (user.role !== "tourist") {
      alert("Only tourists can book tours");
      return;
    }

    alert(
      `Booking feature coming soon! You'll be able to book a tour with ${guide.name}.`
    );
  };

  return (
    <div className="guide-card">
      <div className="guide-image">
        <img src={guide.avatar} alt={guide.name} />
        {guide.isVerified && <div className="verified-badge">Verified</div>}
      </div>

      <div className="guide-info">
        <h3>{guide.name}</h3>
        <div className="guide-location">{guide.location}</div>

        <div className="guide-rating">
          {guide.rating} ({guide.totalReviews} reviews)
        </div>

        <div className="guide-languages">
          {guide.languages &&
            guide.languages.slice(0, 2).map((lang, index) => (
              <span key={index} className="language-tag">
                {lang}
              </span>
            ))}
        </div>

        <div className="guide-specialties">
          {guide.specialties && guide.specialties.slice(0, 2).join(", ")}
        </div>

        <div className="guide-price">${guide.pricePerHour || 50}</div>

        <div className="guide-actions">
          <Link to={`/guides/${guide.id}`} className="btn-view-profile">
            View Profile
          </Link>
          {user && user.role === "tourist" && (
            <button
              onClick={handleBookNow}
              className={`btn-book-now ${!guide.isAvailable ? "disabled" : ""}`}
              disabled={!guide.isAvailable}
            >
              {guide.isAvailable ? "Book Now" : "Not Available"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
