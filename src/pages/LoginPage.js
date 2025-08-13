import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // --- THIS IS THE NEW LOGIC ---
        // Redirect based on the user's role
        switch (result.user.role) {
          case "guide":
            navigate("/guide/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "support":
            navigate("/support/dashboard");
            break;
          case "tourist":
          default:
            navigate("/tourist/dashboard"); // Or just navigate('/')
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
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email của bạn"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
              required
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
      </div>
    </div>
  );
};

export default LoginPage;
