import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import toursService from "../services/toursService";
import "./TourDetailPage.css";

const TourDetailPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await toursService.getTourById(tourId);
      setTour(response);
    } catch (err) {
      console.error("Error fetching tour details:", err);
      setError(err.message || "Failed to load tour details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourDetails();
  }, [tourId]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === 1) return "1 hour";
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} day${days > 1 ? "s" : ""}`;
    return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hour${
      remainingHours > 1 ? "s" : ""
    }`;
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
      <div className="rating-display">
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

  const defaultImages = [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
  ];

  if (loading) {
    return (
      <div className="tour-detail-loading">
        <LoadingSpinner message="Loading tour details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tour-detail-error">
        <div className="error-container">
          <div className="error-icon">😞</div>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              ← Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="tour-detail-error">
        <div className="error-container">
          <div className="error-icon">🔍</div>
          <h2>Tour Not Found</h2>
          <p>The tour you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/tours")} className="btn-primary">
            Browse All Tours
          </button>
        </div>
      </div>
    );
  }

  const images = tour.image_url
    ? [tour.image_url, ...defaultImages.slice(1)]
    : defaultImages;

  return (
    <div className="tour-detail-page">
      {/* Back Navigation */}
      <div className="tour-detail-nav">
        <button onClick={() => navigate(-1)} className="back-button">
          <span className="back-icon">←</span>
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="tour-hero">
        <div className="tour-images">
          <div className="main-image">
            <img
              src={images[selectedImage]}
              alt={tour.title}
              className="hero-image"
            />
          </div>
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`View ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="tour-hero-info">
          <div className="tour-category-badge">
            <span className="category-icon">
              {getCategoryIcon(tour.category)}
            </span>
            <span className="category-text">{tour.category || "Tour"}</span>
          </div>

          <h1 className="tour-title">{tour.title}</h1>

          {tour.rating && (
            <div className="tour-rating-section">
              {renderStars(tour.rating)}
              <span className="reviews-count">
                ({tour.reviews_count || 0} reviews)
              </span>
            </div>
          )}

          <div className="tour-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{tour.location || "Vietnam"}</span>
          </div>

          <div className="tour-price-section">
            <div className="price-main">
              <span className="price-value">{formatPrice(tour.price)}</span>
              <span className="price-unit">per person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Details Content */}
      <div className="tour-content">
        <div className="tour-main-content">
          {/* Tour Quick Info */}
          <div className="tour-quick-info">
            <div className="info-card">
              <div className="info-icon">⏱️</div>
              <div className="info-content">
                <span className="info-label">Duration</span>
                <span className="info-value">
                  {formatDuration(tour.duration_hours)}
                </span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">👥</div>
              <div className="info-content">
                <span className="info-label">Max People</span>
                <span className="info-value">{tour.max_people} people</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🌟</div>
              <div className="info-content">
                <span className="info-label">Difficulty</span>
                <span className="info-value">{tour.difficulty || "Easy"}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🗣️</div>
              <div className="info-content">
                <span className="info-label">Languages</span>
                <span className="info-value">
                  {tour.languages || "English"}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="tour-description-section">
            <h3 className="section-title">About This Tour</h3>
            <div className="description-content">
              <p
                className={`description-text ${
                  showFullDescription ? "expanded" : ""
                }`}
              >
                {tour.description ||
                  "Experience an amazing adventure with professional guides. Discover hidden gems and create unforgettable memories with this carefully crafted tour experience."}
              </p>
              {tour.description && tour.description.length > 300 && (
                <button
                  className="show-more-btn"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>

          {/* What's Included */}
          <div className="tour-includes-section">
            <h3 className="section-title">What's Included</h3>
            <div className="includes-grid">
              <div className="include-item">
                <span className="include-icon">✅</span>
                <span>Professional Guide</span>
              </div>
              <div className="include-item">
                <span className="include-icon">✅</span>
                <span>Transportation</span>
              </div>
              <div className="include-item">
                <span className="include-icon">✅</span>
                <span>Entry Fees</span>
              </div>
              <div className="include-item">
                <span className="include-icon">✅</span>
                <span>Insurance Coverage</span>
              </div>
              <div className="include-item">
                <span className="include-icon">❌</span>
                <span>Personal Expenses</span>
              </div>
              <div className="include-item">
                <span className="include-icon">❌</span>
                <span>Meals (unless specified)</span>
              </div>
            </div>
          </div>

          {/* Guide Information */}
          {tour.guide_name && (
            <div className="tour-guide-section">
              <h3 className="section-title">Your Guide</h3>
              <div className="guide-card">
                <div className="guide-avatar">
                  <img
                    src={
                      tour.guide_avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        tour.guide_name
                      )}&background=667eea&color=fff&size=80`
                    }
                    alt={tour.guide_name}
                  />
                </div>
                <div className="guide-details">
                  <h4 className="guide-name">{tour.guide_name}</h4>
                  <p className="guide-title">Professional Tour Guide</p>
                  <p className="guide-description">
                    Experienced local guide with extensive knowledge of the area
                    and passion for sharing culture and history.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="tour-booking-sidebar">
          <div className="booking-card">
            <div className="booking-price">
              <span className="price-amount">{formatPrice(tour.price)}</span>
              <span className="price-per">per person</span>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label htmlFor="tour-date">Select Date</label>
                <input
                  type="date"
                  id="tour-date"
                  className="date-input"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select id="guests" className="guests-select">
                  {[...Array(Math.min(tour.max_people, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <button className="book-now-btn">
                <span className="btn-icon">📅</span>
                Book Now
              </button>

              <button className="add-to-wishlist-btn">
                <span className="btn-icon">❤️</span>
                Add to Wishlist
              </button>
            </div>

            <div className="booking-note">
              <p>🛡️ Free cancellation up to 24 hours before</p>
              <p>💳 Secure payment guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
