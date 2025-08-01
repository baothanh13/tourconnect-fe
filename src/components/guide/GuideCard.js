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
    e.preventDefault(); // Prevent navigation to guide detail page
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to book a tour');
      return;
    }
    
    if (user.role !== 'tourist') {
      alert('Only tourists can book tours');
      return;
    }
    
    // For now, show an alert. Later this will open a booking modal
    alert(`Booking feature coming soon! You'll be able to book a tour with ${guide.name}.`);
  };

  return (
    <div className="guide-card">
      <Link to={`/guides/${guide.id}`} className="guide-card-link">
        <div className="guide-image-container">
          <img src={guide.avatar} alt={guide.name} className="guide-image" />
          <div className="guide-badges">
            {guide.isVerified && (
              <span className="verified-badge">✓ Verified</span>
            )}
            {guide.isAvailable && (
              <span className="available-badge">Available</span>
            )}
          </div>
        </div>
        
        <div className="guide-content">
          <h3 className="guide-name">{guide.name}</h3>
          <p className="guide-location">📍 {guide.location}</p>
          
          <div className="guide-rating">
            <span className="stars">{renderStars(guide.rating)}</span>
            <span className="rating-text">
              {guide.rating} ({guide.totalReviews} reviews)
            </span>
          </div>
          
          <p className="guide-bio">
            {guide.bio.length > 100 ? `${guide.bio.substring(0, 100)}...` : guide.bio}
          </p>
          
          <div className="guide-specialties">
            {guide.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="specialty-tag">
                {specialty}
              </span>
            ))}
            {guide.specialties.length > 3 && (
              <span className="specialty-more">+{guide.specialties.length - 3} more</span>
            )}
          </div>
          
          <div className="guide-footer">
            <div className="guide-experience">
              <span className="experience-text">
                {guide.experienceYears} years experience
              </span>
            </div>
            <div className="guide-price">
              <span className="price-amount">${guide.pricePerHour}</span>
              <span className="price-unit">/hour</span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Book Now Button - only show for tourists */}
      {user && user.role === 'tourist' && (
        <div className="guide-actions">
          <button 
            onClick={handleBookNow}
            className={`book-btn ${!guide.isAvailable ? 'disabled' : ''}`}
            disabled={!guide.isAvailable}
          >
            {guide.isAvailable ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GuideCard;
