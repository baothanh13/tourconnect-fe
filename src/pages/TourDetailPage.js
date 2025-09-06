import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toursService from "../services/toursService";
import bookingsService from "../services/bookingsService";
import "./TourDetailPage.css";

const TourDetailPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    guests: 1,
    timeSlot: "09:00:00",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

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

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!bookingData.date) {
      alert("Please select a date for your tour");
      return;
    }

    if (!tour.guide_id) {
      alert("Guide information is missing. Please try again.");
      return;
    }

    try {
      setBookingLoading(true);

      const booking = {
        guideId: tour.guide_id,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        duration: tour.duration_hours || 4,
        numberOfTourists: parseInt(bookingData.guests),
        specialRequests: "",
        totalPrice: tour.price * parseInt(bookingData.guests),
      };

      console.log("Sending booking data:", booking);

      const result = await bookingsService.createBooking(booking);
      console.log("Booking result:", result);

      // Navigate to tourist dashboard after success
      alert(
        "Booking request sent successfully! The guide will review your request."
      );
      navigate("/tourist/dashboard");
    } catch (error) {
      console.error("Booking error:", error);
      alert(error.message || "Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                  {Array.isArray(tour.languages)
                    ? tour.languages.join(", ")
                    : tour.languages || "English"}
                </span>
              </div>
            </div>

            {tour.meeting_point && (
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <span className="info-label">Meeting Point</span>
                  <span className="info-value">{tour.meeting_point}</span>
                </div>
              </div>
            )}

            {tour.tour_type && (
              <div className="info-card">
                <div className="info-icon">🎯</div>
                <div className="info-content">
                  <span className="info-label">Tour Type</span>
                  <span className="info-value">{tour.tour_type}</span>
                </div>
              </div>
            )}
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

          {/* Tour Features & Highlights */}
          {(tour.highlights || tour.features || tour.included_items) && (
            <div className="tour-includes-section">
              <h3 className="section-title">Tour Highlights & Features</h3>
              <div className="includes-grid">
                {tour.highlights &&
                  Array.isArray(tour.highlights) &&
                  tour.highlights.map((highlight, index) => (
                    <div key={`highlight-${index}`} className="include-item">
                      <span className="include-icon">⭐</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                {tour.features &&
                  Array.isArray(tour.features) &&
                  tour.features.map((feature, index) => (
                    <div key={`feature-${index}`} className="include-item">
                      <span className="include-icon">✅</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                {tour.included_items &&
                  Array.isArray(tour.included_items) &&
                  tour.included_items.map((item, index) => (
                    <div key={`item-${index}`} className="include-item">
                      <span className="include-icon">📦</span>
                      <span>{item}</span>
                    </div>
                  ))}

                {/* Default items if no specific data */}
                {!tour.highlights && !tour.features && !tour.included_items && (
                  <>
                    <div className="include-item">
                      <span className="include-icon">✅</span>
                      <span>Professional tour guide</span>
                    </div>
                    <div className="include-item">
                      <span className="include-icon">✅</span>
                      <span>Local expertise and insights</span>
                    </div>
                    <div className="include-item">
                      <span className="include-icon">✅</span>
                      <span>Personalized experience</span>
                    </div>
                    <div className="include-item">
                      <span className="include-icon">✅</span>
                      <span>Safety equipment if needed</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* What's Included (fallback if no highlights/features) */}
          {!tour.highlights && !tour.features && !tour.included_items && (
            <div className="tour-includes-section">
              <h3 className="section-title">What's Included</h3>
              <div className="includes-grid">
                <div className="include-item">
                  <span className="include-icon">✅</span>
                  <span>Professional Guide</span>
                </div>
                <div className="include-item">
                  <span className="include-icon">✅</span>
                  <span>Local expertise and insights</span>
                </div>
                <div className="include-item">
                  <span className="include-icon">✅</span>
                  <span>Personalized experience</span>
                </div>
                <div className="include-item">
                  <span className="include-icon">✅</span>
                  <span>Safety equipment if needed</span>
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
          )}

          {/* Additional Tour Information */}
          {(tour.itinerary || tour.schedule || tour.notes) && (
            <div className="tour-additional-info">
              {tour.itinerary && (
                <div className="info-section">
                  <h3 className="section-title">Itinerary</h3>
                  <div className="info-content">
                    <p>{tour.itinerary}</p>
                  </div>
                </div>
              )}

              {tour.schedule && (
                <div className="info-section">
                  <h3 className="section-title">Schedule</h3>
                  <div className="info-content">
                    <p>{tour.schedule}</p>
                  </div>
                </div>
              )}

              {tour.notes && (
                <div className="info-section">
                  <h3 className="section-title">Important Notes</h3>
                  <div className="info-content">
                    <p>{tour.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

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
                  value={bookingData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  className="guests-select"
                  value={bookingData.guests}
                  onChange={(e) => handleInputChange("guests", e.target.value)}
                >
                  {[...Array(Math.min(tour.max_people, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timeSlot">Preferred Time</label>
                <select
                  id="timeSlot"
                  className="guests-select"
                  value={bookingData.timeSlot}
                  onChange={(e) =>
                    handleInputChange("timeSlot", e.target.value)
                  }
                >
                  <option value="09:00:00">09:00 AM</option>
                  <option value="10:00:00">10:00 AM</option>
                  <option value="11:00:00">11:00 AM</option>
                  <option value="12:00:00">12:00 PM</option>
                  <option value="13:00:00">01:00 PM</option>
                  <option value="14:00:00">02:00 PM</option>
                  <option value="15:00:00">03:00 PM</option>
                  <option value="16:00:00">04:00 PM</option>
                </select>
              </div>

              {/* Total Price Display */}
              <div className="total-price-section">
                <div className="price-breakdown">
                  <span className="price-label">Total Price:</span>
                  <span className="total-amount">
                    {formatPrice(tour.price * parseInt(bookingData.guests))}
                  </span>
                </div>
                <span className="price-note">
                  ({bookingData.guests} guest
                  {parseInt(bookingData.guests) > 1 ? "s" : ""} ×{" "}
                  {formatPrice(tour.price)})
                </span>
              </div>

              <button
                className="book-now-btn"
                onClick={handleBookingSubmit}
                disabled={bookingLoading}
              >
                <span className="btn-icon">{bookingLoading ? "⏳" : "📅"}</span>
                {bookingLoading
                  ? "Processing..."
                  : isAuthenticated
                  ? "Book Now"
                  : "Login to Book"}
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
