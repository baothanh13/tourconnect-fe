import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import guidesService from "../services/guidesService";
import "./GuideDetailPage.css";

const GuideDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const reviewsData = await guidesService.getGuideReviews(id);
        setReviews(reviewsData?.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    const fetchGuideDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const guideData = await guidesService.getGuideById(id);
        setGuide(guideData);

        // Fetch reviews as well
        await fetchReviews();
      } catch (err) {
        console.error("Error fetching guide details:", err);
        setError(err.message || "Failed to fetch guide details");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideDetails();
  }, [id]);

  const renderStars = (rating) => {
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
    if (!languages || languages.length === 0) return "Not specified";
    if (Array.isArray(languages)) {
      return languages.join(", ");
    }
    return languages;
  };

  const formatSpecialties = (specialties) => {
    if (!specialties || specialties.length === 0) return "General tours";
    if (Array.isArray(specialties)) {
      return specialties.join(", ");
    }
    return specialties;
  };



  if (loading) {
    return (
      <div className="guide-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading guide details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guide-detail-page">
        <div className="error-container">
          <h2>❌ Error Loading Guide</h2>
          <p>{error}</p>
          <Link to="/guides" className="btn btn-primary">
            ← Back to Guides List
          </Link>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="guide-detail-page">
        <div className="error-container">
          <h2>🔍 Guide Not Found</h2>
          <p>The guide you're looking for doesn't exist or has been removed.</p>
          <Link to="/guides" className="btn btn-primary">
            ← Back to Guides List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-detail-page">
      <div className="guide-detail-container">
        {/* Navigation */}
        <div className="guide-detail-header">
          <Link to="/guides" className="back-link">
            ← Back to Guides
          </Link>
        </div>

        {/* Main Profile Section */}
        <div className="guide-profile-section">
          {/* Left Column - Profile Info */}
          <div className="guide-profile-main">
            <div className="guide-avatar-section">
              <img
                src={
                  guide.avatar_url ||
                  "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
                }
                alt={guide.user_name}
                className="guide-avatar-large"
              />

              {/* Status Badges */}
              <div className="status-badges">
                {guide.verification_status === "verified" && (
                  <span className="badge verified">✓ Verified Guide</span>
                )}
                {guide.is_available && (
                  <span className="badge available">🟢 Available Now</span>
                )}
              </div>
            </div>

            <div className="guide-basic-info">
              <h1 className="guide-name">{guide.user_name}</h1>
              <p className="guide-location">📍 {guide.location}</p>
              <p className="guide-current-location">
                🌍 Currently in: {guide.current_location || guide.location}
              </p>

              {/* Rating Section */}
              <div className="rating-section">
                <div className="stars-display">{renderStars(guide.rating)}</div>
                <span className="rating-text">
                  {guide.rating ? parseFloat(guide.rating).toFixed(1) : "0.0"}
                  /5.0
                </span>
                <span className="reviews-count">
                  ({guide.total_reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="price-section">
                <span className="price-label">Starting from</span>
                <span className="price-amount-guide-details">
                  ${guide.price_per_hour}/hour
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="guide-stats-sidebar">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-content">
                <span className="stat-label">Experience</span>
                <span className="stat-value">
                  {guide.experience_years || 0} years
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🗣️</div>
              <div className="stat-content">
                <span className="stat-label">Languages</span>
                <span className="stat-value">
                  {formatLanguages(guide.languages)}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-label">Specialties</span>
                <span className="stat-value">
                  {formatSpecialties(guide.specialties)}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-content">
                <span className="stat-label">Contact</span>
                <span className="stat-value">
                  {guide.phone || "Via platform"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({guide.total_reviews || 0})
          </button>
          <button
            className={`tab-button ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact & Booking
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="overview-tab">
              {/* Description Section */}
              <div className="section-card">
                <h3 className="section-title">About Me</h3>
                <p className="guide-description">
                  {guide.description ||
                    "I'm a passionate local guide ready to show you the best of our beautiful destination. With years of experience and deep local knowledge, I'll help you discover hidden gems and create unforgettable memories."}
                </p>
              </div>

              {/* Specialties Section */}
              <div className="section-card">
                <h3 className="section-title">Tour Specialties</h3>
                <div className="specialties-list">
                  {formatSpecialties(guide.specialties)
                    .split(", ")
                    .map((specialty, index) => (
                      <span key={index} className="specialty-tag">
                        {specialty}
                      </span>
                    ))}
                </div>
              </div>

              {/* Languages Section */}
              <div className="section-card">
                <h3 className="section-title">Languages I Speak</h3>
                <div className="languages-list">
                  {formatLanguages(guide.languages)
                    .split(", ")
                    .map((language, index) => (
                      <span key={index} className="language-tag">
                        🗣️ {language}
                      </span>
                    ))}
                </div>
              </div>

              {/* Certifications Section */}
                <div className="section-card">
                  <div className="section-header">
                    <h3 className="section-title">Certifications & Licenses</h3>
                    {guide.certificate_img && (
                      <button
                        className="view-all-certificates-btn"
                        onClick={() => setShowCertificateModal(true)}
                      >
                        View Certificates
                      </button>
                    )}
                  </div>

                </div>
            {showCertificateModal && guide.certificate_img && (
              <div
                className="certificate-modal-overlay"
                onClick={() => setShowCertificateModal(false)}
              >
                <div
                  className="certificate-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h3>Certificate Images</h3>
                    <button
                      className="modal-close-btn"
                      onClick={() => setShowCertificateModal(false)}
                    >
                      ✖
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="certificate-images-list">
                      {(() => {
                        let imageUrls = [];

                        if (typeof guide.certificate_img === "string") {
                          try {
                            const parsed = JSON.parse(guide.certificate_img);
                            imageUrls = Array.isArray(parsed)
                              ? parsed
                              : [guide.certificate_img];
                          } catch {
                            imageUrls = [guide.certificate_img];
                          }
                        } else if (Array.isArray(guide.certificate_img)) {
                          imageUrls = guide.certificate_img;
                        }

                        return imageUrls.map((url, index) => (
                          <div key={index} className="certificate-image-list-item">
                            <img
                              src={url}
                              alt={`Certificate ${index + 1}`}
                              className="certificate-image"
                            />
                            <div className="certificate-image-url">
                              <small>{url}</small>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Kết thúc modal */}

          </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="reviews-tab">
              <div className="section-card">
                <h3 className="section-title">Customer Reviews</h3>
                {reviewsLoading ? (
                  <div className="loading-reviews">
                    <div className="loading-spinner-small"></div>
                    <p>Loading reviews...</p>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                          <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        {review.tour_title && (
                          <span className="review-tour">
                            Tour: {review.tour_title}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>
                      No reviews yet. Be the first to book and review this
                      guide!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="contact-tab">
              <div className="section-card">
                <h3 className="section-title">Ready to Book?</h3>
                <p className="contact-description">
                  Get in touch with {guide.user_name} to plan your perfect tour
                  experience.
                </p>

                <div className="contact-options">
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">💰</span>
                      <div className="contact-details">
                        <span className="contact-label">Hourly Rate</span>
                        <span className="contact-value">
                          ${guide.price_per_hour}/hour
                        </span>
                      </div>
                    </div>

                    <div className="contact-item">
                      <span className="contact-icon">⏰</span>
                      <div className="contact-details">
                        <span className="contact-label">Availability</span>
                        <span className="contact-value">
                          {guide.is_available
                            ? "Available now"
                            : "Currently busy"}
                        </span>
                      </div>
                    </div>

                    {guide.phone && (
                      <div className="contact-item">
                        <span className="contact-icon">📱</span>
                        <div className="contact-details">
                          <span className="contact-label">Phone</span>
                          <span className="contact-value">{guide.phone}</span>
                        </div>
                      </div>
                    )}

                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <div className="contact-details">
                        <span className="contact-label">Email</span>
                        <span className="contact-value">
                          {guide.user_email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {isAuthenticated ? (
                      <Link
                        to={`/booking/${guide.id}`}
                        className="btn btn-primary btn-large"
                      >
                        📅 Book Now
                      </Link>
                    ) : (
                      <Link to="/login" className="btn btn-primary btn-large">
                        📅 Login to Book
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideDetailPage;
