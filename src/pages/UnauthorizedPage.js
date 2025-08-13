import React from "react";
import { Link } from "react-router-dom";
import "./UnauthorizedPage.css";

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon">🚫</div>
        <h1>403 - Không có quyền truy cập</h1>
        <p>
          Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài
          khoản phù hợp.
        </p>
        <div className="unauthorized-actions">
          <Link to="/login" className="login-link">
            Đăng nhập lại
          </Link>
          <Link to="/" className="home-link">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
