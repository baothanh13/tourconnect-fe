import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "tourist", // Default to tourist
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.userType
      );

      if (result.success) {
        // Redirect based on user type
        switch (result.user.userType) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "guide":
            navigate("/guide/dashboard");
            break;
          case "support":
            navigate("/support/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(result.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Đăng nhập TourConnect</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userType">Loại tài khoản:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              required
            >
              <option value="tourist">Du khách</option>
              <option value="guide">Hướng dẫn viên</option>
              <option value="support">Nhân viên hỗ trợ</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
          <Link to="/">← Quay về trang chủ</Link>
        </div>

        {/* Demo credentials for testing */}
        <div className="demo-credentials">
          <h4>Tài khoản demo:</h4>
          <p>
            <strong>Du khách:</strong> tourist@example.com / 123456
          </p>
          <p>
            <strong>Hướng dẫn viên:</strong> guide@example.com / 123456
          </p>
          <p>
            <strong>Admin:</strong> admin@tourconnect.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
