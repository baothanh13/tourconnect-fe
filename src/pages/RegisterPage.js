import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "tourist",
    city: "",
    specialties: [],
    bio: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle specialties checkboxes
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          specialties: [...prev.specialties, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          specialties: prev.specialties.filter((s) => s !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        // Redirect to appropriate page
        navigate("/");
      } else {
        setError(result.error || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const specialtiesList = [
    "Cultural Tours",
    "Food Tours",
    "Historical Sites",
    "Beach Tours",
    "Mountain Hiking",
    "Photography Tours",
    "War History",
    "Architecture",
    "Nightlife Tours",
    "Shopping Tours",
    "Adventure Tours",
    "Eco Tours",
  ];

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Đăng ký TourConnect</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
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
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Họ và tên:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+84..."
              />
            </div>
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Ít nhất 6 ký tự"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>

          {formData.userType === "guide" && (
            <>
              <div className="form-group">
                <label htmlFor="city">Thành phố:</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn thành phố</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Huế">Huế</option>
                  <option value="Hội An">Hội An</option>
                  <option value="Nha Trang">Nha Trang</option>
                </select>
              </div>

              <div className="form-group">
                <label>Chuyên môn:</label>
                <div className="specialties-grid">
                  {specialtiesList.map((specialty) => (
                    <label key={specialty} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onChange={handleInputChange}
                      />
                      {specialty}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Giới thiệu bản thân:</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Mô tả kinh nghiệm, kỹ năng và những gì bạn có thể mang lại cho du khách..."
                  rows="4"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="register-links">
          <Link to="/login">Đã có tài khoản? Đăng nhập ngay</Link>
          <Link to="/">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
