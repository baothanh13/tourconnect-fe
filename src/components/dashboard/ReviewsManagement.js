import React, { useEffect, useState, useCallback } from "react";
import { reviewsService } from "../../services/reviewsService";
import Loading from "../Loading";
import "./ReviewManagement.css";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reviewsService.getAllReviews();

      // Handle possible shapes: { reviews: [...] } or direct array
      const rows = Array.isArray(data) ? data : Array.isArray(data?.reviews) ? data.reviews : [];
      setReviews(rows);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews. Please try again later.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="reviews-management">
      <div className="reviews-management-header">
        <h2>Reviews Management</h2>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchReviews}>Refresh</button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {reviews.length === 0 ? (
        <div className="no-reviews">No reviews found.</div>
      ) : (
        <div className="reviews-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Booking ID</th>
                <th>Guide Name</th>
                <th>Tour Title</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((rev) => (
                <tr key={rev.id}>
                  <td className="mono-cell" title={rev.id}>{rev.id}</td>
                  <td className="mono-cell" title={rev.booking_id}>{rev.booking_id}</td>
                  <td title={rev.guide_name}>{rev.guide_name}</td>
                  <td className="title-cell" title={rev.tour_title}>{rev.tour_title}</td>
                  <td className="rating-cell" title={String(rev.rating)}>{rev.rating}</td>
                  <td className="comment-cell" title={rev.comment}>{rev.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;


