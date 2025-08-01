import React from "react";
import { Link } from "react-router-dom";

const GuideCard = ({ guide }) => {
  return (
    <Link to={`/guides/${guide.id}`} className="guide-card">
      <div className="card-image-container">
        <img src={guide.avatar} alt={guide.name} className="card-avatar" />
        {/* Chỉ hiển thị tick "Đã xác minh" nếu isVerified là true */}
        {guide.isVerified && (
          <div className="verified-badge">✔ Đã xác minh</div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-name">{guide.name}</h3>
        <p className="card-city">📍 {guide.city}</p>
        <div className="card-rating">
          <span>⭐ {guide.rating}</span>
        </div>
      </div>
    </Link>
  );
};
export default GuideCard;
