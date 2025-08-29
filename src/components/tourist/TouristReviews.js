import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import touristService from "../../services/touristService";
import Loading from "../Loading";
import {
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import "./TouristReviews.css";

const TouristReviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    tour_id: "",
    booking_id: "",
  });

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewsData = await touristService.getTouristReviews(user.id);
      setReviews(reviewsData);
    } catch (err) {
      setError("Failed to load reviews. Please try again.");
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleCreateReview = async (e) => {
    e.preventDefault();
      try {
        const reviewData = {
        user_id: user.id,   // lấy id từ token hoặc state user
        ...newReview,       // spread toàn bộ dữ liệu review nhập form
      };

      await touristService.createReview(reviewData); // chỉ truyền 1 object
      setShowCreateModal(false);
      setNewReview({
        rating: 5,
        comment: "",
        tour_id: "",
        booking_id: "",
      });
      loadReviews();
    } catch (err) {
      setError("Failed to create review. Please try again.");
      console.error("Error creating review:", err);
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {
      await touristService.updateReview(selectedReview.id, {
        rating: selectedReview.rating,
        comment: selectedReview.comment,
      });
      setShowEditModal(false);
      setSelectedReview(null);
      loadReviews();
    } catch (err) {
      setError("Failed to update review. Please try again.");
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await touristService.deleteReview(reviewId);
      loadReviews();
    } catch (err) {
      setError("Failed to delete review. Please try again.");
      console.error("Error deleting review:", err);
    }
  };

  const openEditModal = (review) => {
    setSelectedReview(review);
    setShowEditModal(true);
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${
              interactive ? "interactive" : ""
            }`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.tour_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.guide_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  if (loading) return <Loading />;

  return (
    <div className="tourist-reviews">
      {/* Header with back button and title */}
      <div className="page-header">
        <button
          className="back-button"
          onClick={() => navigate("/tourist/dashboard")}
        >
          <FaArrowLeft />
        </button>
        <div className="page-title-center">
          <h2>My Reviews</h2>
          <p>Share your experiences and rate the tours you've taken</p>
        </div>
        <button
          className="btn-primary add-review-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Write Review
        </button>
      </div>

      {/* Statistics Cards - 2x2 Grid */}
      <div className="review-stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <div className="stat-number">{reviews.length}</div>
            <div className="stat-label">TOTAL REVIEWS</div>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating, 0) /
                    reviews.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <div className="stat-label">AVERAGE RATING</div>
          </div>
        </div>

        <div className="stat-card five-star">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {reviews.filter((r) => r.rating === 5).length}
            </div>
            <div className="stat-label">5 STAR REVIEWS</div>
          </div>
        </div>

        <div className="stat-card recent">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {
                reviews.filter((r) => {
                  const reviewDate = new Date(r.created_at);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return reviewDate >= thirtyDaysAgo;
                }).length
              }
            </div>
            <div className="stat-label">RECENT REVIEWS</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h3>SEARCH REVIEWS</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by tour name or review content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>FILTER BY RATING</h3>
        <div className="filter-tabs">
          <button
            className={filterRating === "all" ? "active" : ""}
            onClick={() => setFilterRating("all")}
          >
            All Ratings
          </button>
          <button
            className={filterRating === "5" ? "active" : ""}
            onClick={() => setFilterRating("5")}
          >
            5 Stars
          </button>
          <button
            className={filterRating === "4" ? "active" : ""}
            onClick={() => setFilterRating("4")}
          >
            4 Stars
          </button>
          <button
            className={filterRating === "3" ? "active" : ""}
            onClick={() => setFilterRating("3")}
          >
            3 Stars
          </button>
          <button
            className={filterRating === "2" ? "active" : ""}
            onClick={() => setFilterRating("2")}
          >
            2 Stars
          </button>
          <button
            className={filterRating === "1" ? "active" : ""}
            onClick={() => setFilterRating("1")}
          >
            1 Star
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button onClick={loadReviews}>Retry</button>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <FaStar className="no-reviews-icon" />
            <h3>No reviews found</h3>
            <p>
              {searchQuery || filterRating !== "all"
                ? "No reviews match your current filters."
                : "You haven't written any reviews yet."}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-info">
                  <h4>{review.tour_title || "Tour Title"}</h4>
                  <p className="guide-name">
                    <FaUser /> Guide: {review.guide_name || "Unknown"}
                  </p>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="review-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => openEditModal(review)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>

              <div className="review-footer">
                <span className="review-date">
                  <FaCalendarAlt />{" "}
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Review Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Review</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {renderStars(newReview.rating, true, (rating) =>
                    setNewReview({ ...newReview, rating })
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Tour ID</label>
                <input
                  type="text"
                  value={newReview.tour_id}
                  onChange={(e) =>
                    setNewReview({ ...newReview, tour_id: e.target.value })
                  }
                  placeholder="Enter tour ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Booking ID (Optional)</label>
                <input
                  type="text"
                  value={newReview.booking_id}
                  onChange={(e) =>
                    setNewReview({ ...newReview, booking_id: e.target.value })
                  }
                  placeholder="Enter booking ID"
                />
              </div>

              <div className="form-group">
                <label>Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && selectedReview && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Review</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditReview}>
              <div className="form-group">
                <label>Rating</label>
                <div className="rating-input">
                  {renderStars(selectedReview.rating, true, (rating) =>
                    setSelectedReview({ ...selectedReview, rating })
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Review</label>
                <textarea
                  value={selectedReview.comment}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      comment: e.target.value,
                    })
                  }
                  placeholder="Share your experience..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristReviews;
