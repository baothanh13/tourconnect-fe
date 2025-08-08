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
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        // Redirect to appropriate page
        navigate("/");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
        <h1>Register for TourConnect</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="userType">Account Type:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              required
            >
              <option value="tourist">Tourist</option>
              <option value="guide">Tour Guide</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
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
              placeholder="Enter your email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Re-enter password"
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
                  placeholder="Describe your experience, skills and what you can offer to tourists..."
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
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="register-links">
          <Link to="/login">Already have an account? Login now</Link>
          <Link to="/">← Back to homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
