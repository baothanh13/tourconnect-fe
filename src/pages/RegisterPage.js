import React, { useState } from "react";
import { Link } from "react-router-dom";
import OtpForm from "../components/OtpForm";
import "./RegisterPage.css";

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
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // <-- step state
  const [registeredEmail, setRegisteredEmail] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        specialties: checked
          ? [...prev.specialties, value]
          : prev.specialties.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.userType,
      };

      // Add guide-specific data if user is registering as a guide
      if (formData.userType === "guide") {
        registrationData.city = formData.city;
        registrationData.specialties = formData.specialties;
        registrationData.bio = formData.bio;
      }

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await res.json();

      if (res.status === 201) {
        localStorage.setItem("otpToken", data.otpToken);
        localStorage.setItem("userId", data.user_id);

        setSuccess(
          "Để xác thực tài khoản! Vui lòng nhập OTP được gửi qua email."
        );
        setRegisteredEmail(formData.email); // save email for OTP form
        setOtpStep(true); // switch to OTP form
      } else {
        setError(data.error || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setError("Đã xảy ra lỗi máy chủ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Đăng ký TourConnect</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!otpStep ? (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Loại tài khoản:</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              >
                <option value="tourist">Du khách</option>
                <option value="guide">Hướng dẫn viên</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+84..."
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Ít nhất 6 ký tự"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập lại mật khẩu"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {formData.userType === "guide" && (
              <>
                <div className="form-group">
                  <label>Thành phố:</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isLoading}
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
                      <label key={specialty}>
                        <input
                          type="checkbox"
                          value={specialty}
                          checked={formData.specialties.includes(specialty)}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {specialty}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Giới thiệu bản thân:</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Mô tả kinh nghiệm, kỹ năng và những gì bạn có thể mang đến..."
                    rows="4"
                    disabled={isLoading}
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
        ) : (
          <OtpForm email={registeredEmail} />
        )}

        {!otpStep && (
          <div className="register-links">
            <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
            <Link to="/">← Quay về trang chủ</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
