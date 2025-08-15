import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import OtpForm from "../components/OtpForm";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, confirmOTP } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "tourist", // Changed from userType to role to match backend
    city: "",
    specialties: [],
    bio: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpToken, setOtpToken] = useState("");
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
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      };

      // Add guide-specific data if user is registering as a guide
      if (formData.role === "guide") {
        registrationData.city = formData.city;
        registrationData.specialties = formData.specialties;
        registrationData.bio = formData.bio;
      }

      const result = await register(registrationData);

      if (result.success) {
        setOtpToken(result.otpToken);
        setRegisteredEmail(formData.email);
        setSuccess(result.message);
        setOtpStep(true);
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Server error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await confirmOTP(otp, otpToken);

      if (result.success) {
        setSuccess("Account verified successfully! Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.error || "OTP verification failed.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">Register for TourConnect</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!otpStep ? (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Account Type:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              >
                <option value="tourist">Tourist</option>
                <option value="guide">Tour Guide</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
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
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {formData.role === "guide" && (
              <>
                <div className="form-group">
                  <label>City:</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  >
                    <option value="">Select City</option>
                    <option value="Ha Noi">Ha Noi</option>
                    <option value="Da Nang">Da Nang</option>
                    <option value="Ho Chi Minh">Ho Chi Minh</option>
                    <option value="Hue">Hue</option>
                    <option value="Hoi An">Hoi An</option>
                    <option value="Nha Trang">Nha Trang</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Specialties:</label>
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
                  <label>Bio:</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Describe your experience, skills and what you can offer..."
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
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
        ) : (
          <OtpForm
            email={registeredEmail}
            onSubmit={handleOtpSubmit}
            isLoading={isLoading}
          />
        )}

        {!otpStep && (
          <div className="register-links">
            <Link to="/login">Already have an account? Login</Link>
            <Link to="/">← Back to Home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
