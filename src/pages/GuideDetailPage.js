import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { mockGuides } from "../data/mockData";
import "./GuideDetailPage.css";
import "./GuideDetailPage.css";

const GuideDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  // Tìm hướng dẫn viên theo id
  const guide = mockGuides.find((g) => g.id === parseInt(id));

  // Nếu không tìm thấy hướng dẫn viên
  if (!guide) {
    return (
      <div className="guide-detail-page">
        <h2>Không tìm thấy hướng dẫn viên</h2>
        <Link to="/guides">← Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="guide-detail-page">
      <Link to="/guides" className="back-link">
        ← Quay lại danh sách
      </Link>

      <div className="guide-detail-content">
        <div className="guide-header">
          <img
            src={guide.avatar}
            alt={guide.name}
            className="guide-avatar-large"
          />
          <div className="guide-info">
            <h1>{guide.name}</h1>
            <p className="guide-location">📍 {guide.city}</p>
            <div className="guide-rating">
              <span>⭐ {guide.rating}</span>
              {guide.isVerified && (
                <span className="verified-badge">✔ Đã xác minh</span>
              )}
            </div>
          </div>
        </div>

        <div className="guide-bio">
          <h3>Giới thiệu</h3>
          <p>{guide.bio}</p>
        </div>

        <div className="contact-section">
          <div className="action-buttons">
            <button className="contact-button">💬 Liên hệ hướng dẫn viên</button>
            {isAuthenticated ? (
              <Link to={`/booking/${guide.id}`} className="book-button">
                🎫 Đặt tour ngay
              </Link>
            ) : (
              <Link to="/login" className="book-button">
                🎫 Đăng nhập để đặt tour
              </Link>
            )}
          </div>
          <div className="guide-price">
            <span className="price-label">Giá:</span>
            <span className="price-value">${guide.pricePerDay || 100}/ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailPage;
