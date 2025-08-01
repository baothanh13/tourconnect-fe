import React from "react";
import { useParams, Link } from "react-router-dom";
import { mockGuides } from "../data/mockData";

const GuideDetailPage = () => {
  const { id } = useParams();

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
          <button className="contact-button">Liên hệ hướng dẫn viên</button>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailPage;
