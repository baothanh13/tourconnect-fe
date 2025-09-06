import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import {
  FaStar,
  FaCalendarAlt,
  FaUser,
  FaExclamationTriangle,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";
import "./GuideReviews.css";

const GuideReviews = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [guideProfile, setGuideProfile] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const loadGuideProfile = useCallback(async () => {
    try {
      const profile = await guidesService.getGuideByUserId(user.id);
      setGuideProfile(profile);
      return profile;
    } catch (err) {
      console.error("Error loading guide profile:", err);
      setError("Failed to load guide profile. Please try again.");
      return null;
    }
  }, [user.id]);

  const loadReviews = useCallback(
    async (page = 1) => {
      if (!guideProfile?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await guidesService.getGuideReviews(guideProfile.id, {
          page,
          limit: pagination.limit,
        });

        setReviews(response.reviews || []);
        setPagination((prev) => ({
          ...prev,
          page: response.page || page,
          total: response.total || 0,
        }));
      } catch (err) {
        setError("Failed to load reviews. Please try again.");
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    },
    [guideProfile?.id, pagination.limit]
  );

  useEffect(() => {
    const initializeData = async () => {
      const profile = await loadGuideProfile();
      if (profile) {
        await loadReviews(1);
      }
    };

    initializeData();
  }, [loadGuideProfile, loadReviews]);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= rating ? "filled" : ""}`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.tour_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const handlePageChange = (newPage) => {
    loadReviews(newPage);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading && reviews.length === 0) return <Loading />;

  return (
    <div className="guide-reviews">
      {/* Header with back button and title */}
      <div className="page-header-guide">
        <button
          className="back-button-guide"
          onClick={() => navigate("/guide/dashboard")}
        >
          <FaArrowLeft />
        </button>
        <div className="page-title-center-guide">
          <h2>My Reviews</h2>
          <p>See what tourists are saying about your tours</p>
        </div>
      </div>

      {/* Statistics Cards - 2x2 Grid */}
      <div className="review-stats-grid-guide">
        <div className="stat-card-guide total">
          <div className="stat-icon-guide">
            <FaStar />
          </div>
          <div className="stat-content-guide">
            <div className="stat-number-guide">{pagination.total}</div>
            <div className="stat-label-guide">TOTAL REVIEWS</div>
          </div>
        </div>

        <div className="stat-card-guide average">
          <div className="stat-icon-guide">
            <FaStar />
          </div>
          <div className="stat-content-guide">
            <div className="stat-number-guide">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
                    reviews.length
                  ).toFixed(1)
                : "0.0"}
            </div>
            <div className="stat-label">AVERAGE RATING</div>
          </div>
        </div>

        <div className="stat-card-guide five-star">
          <div className="stat-icon-guide">
            <FaStar />
          </div>
          <div className="stat-content-guide">
            <div className="stat-number-guide">{reviews.filter((r) => Number(r.rating) === 5).length}</div>
            <div className="stat-label-guide">5 STAR REVIEWS</div>
          </div>
        </div>

        <div className="stat-card-guide recent">
          <div className="stat-icon-guide">
            <FaCalendarAlt />
          </div>
          <div className="stat-content-guide">
            <div className="stat-number-guide">
              {
                reviews.filter((r) => {
                  const reviewDate = new Date(r.created_at);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return reviewDate >= thirtyDaysAgo;
                }).length
              }
            </div>
            <div className="stat-label-guide">RECENT REVIEWS</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section-guide">
        <h3>SEARCH REVIEWS</h3>
        <div className="search-box-guide">
          <input
            type="text"
            placeholder="Search by tour name or review content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section-guide">
        <h3>FILTER BY RATING</h3>
        <div className="filter-tabs-guide">
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
          <button onClick={() => loadReviews(pagination.page)}>Retry</button>
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
                : "You haven't received any reviews yet."}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="review-card-guide">
              <div className="review-header-guide">
                <div className="review-info-guide">
                  <h4>{review.tour_title || "Tour Title"}</h4>
                  <p className="tourist-name-guide">
                    <FaUser /> {review.tourist_name || "Unknown Tourist"}
                  </p>
                  <p className="tourist-name-guide">
                    <FaUser /> {review.tourist_email || "Unknown Email"}
                  </p>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="review-actions">
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

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default GuideReviews;
