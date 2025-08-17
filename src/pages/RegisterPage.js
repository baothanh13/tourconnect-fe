import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import OtpForm from "../components/OtpForm";
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, confirmOTP } = useAuth();

  // State to manage form step
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "tourist",
    city: "",
    specialties: [],
    bio: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  };

  const handleNextStep = () => {
    setError("");
    // Improved validation for Step 1
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await register(formData);
      if (result.success) {
        setOtpToken(result.otpToken);
        setRegisteredEmail(formData.email);
        setSuccess(result.message);
        setStep(3); // Move to OTP step
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
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
        setSuccess("Account verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(result.error || "OTP verification failed.");
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1 className="register-title">
          {step < 3 ? "Create Your Account" : "Verify Your Email"}
        </h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {step < 3 && <div className="step-indicator">Step {step} of 2</div>}

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          {step === 1 && (
            <>
              {/* --- STEP 1: Basic Info --- */}
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+84..."
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="At least 6 characters"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              <div className="form-navigation">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="register-button"
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* --- STEP 2: Profile Details --- */}
              <div className="form-group">
                <label htmlFor="role">Account Type:</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="tourist">Tourist</option>
                  <option value="guide">Tour Guide</option>
                </select>
              </div>

              {formData.role === "guide" && (
                <>
                  <div className="form-group">
                    <label htmlFor="city">City:</label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select City</option>
                      <option value="Ha Noi">Ha Noi</option>
                      <option value="Da Nang">Da Nang</option>
                      <option value="Ho Chi Minh">Ho Chi Minh</option>
                      {/* Add other cities as needed */}
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
                          />
                          {specialty}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Describe your experience, skills..."
                      rows="4"
                    />
                  </div>
                </>
              )}
              <div className="form-navigation">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="back-button"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="register-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </>
          )}
        </form>

        {step === 3 && (
          <OtpForm
            email={registeredEmail}
            onSubmit={handleOtpSubmit}
            isLoading={isLoading}
          />
        )}

        {step < 3 && (
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
