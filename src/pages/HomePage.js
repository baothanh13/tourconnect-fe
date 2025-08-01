import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1>Chào mừng đến với TourConnect</h1>
        <p>Kết nối bạn với những hướng dẫn viên địa phương chuyên nghiệp</p>
        <Link to="/guides" className="cta-button">
          Tìm Hướng Dẫn Viên
        </Link>
      </section>

      <section className="features-section">
        <h2>Tại sao chọn TourConnect?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Hướng dẫn viên đã xác minh</h3>
            <p>Tất cả HDV đều được kiểm tra kỹ lưỡng về năng lực và uy tín</p>
          </div>
          <div className="feature-card">
            <h3>Trải nghiệm địa phương</h3>
            <p>Khám phá những điều thú vị mà chỉ người bản địa mới biết</p>
          </div>
          <div className="feature-card">
            <h3>Đánh giá minh bạch</h3>
            <p>Hệ thống đánh giá từ khách hàng thực tế</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
