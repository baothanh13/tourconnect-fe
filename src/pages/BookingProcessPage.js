import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./BookingProcessPage.css";

const BookingProcessPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    destination: "",
    guide: "",
    dates: { start: "", end: "" },
    travelers: 1,
    preferences: [],
    specialRequests: "",
  });

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="booking-process-page">
        <div className="auth-required">
          <div className="auth-content">
            <h1>🔒 Login Required</h1>
            <p>Please log in to access the booking process</p>
            <button onClick={() => navigate("/login")} className="login-btn">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Destination", icon: "🗺️" },
    { number: 2, title: "Guide Selection", icon: "👨‍🏫" },
    { number: 3, title: "Dates & Details", icon: "📅" },
    { number: 4, title: "Review & Payment", icon: "💳" },
  ];

  const destinations = [
    { id: 1, name: "Tokyo, Japan", image: "🗼", popular: true },
    { id: 2, name: "Paris, France", image: "🗼", popular: true },
    { id: 3, name: "Bali, Indonesia", image: "🏝️", popular: true },
    { id: 4, name: "New York, USA", image: "🏙️", popular: false },
    { id: 5, name: "London, UK", image: "🏰", popular: false },
    { id: 6, name: "Rome, Italy", image: "🏛️", popular: true },
  ];

  const guides = [
    {
      id: 1,
      name: "Kenji Tanaka",
      rating: 4.9,
      tours: 156,
      price: 85,
      specialty: "Cultural Tours",
      image: "👨",
    },
    {
      id: 2,
      name: "Marie Dubois",
      rating: 4.8,
      tours: 203,
      price: 75,
      specialty: "Historical Tours",
      image: "👩",
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      rating: 4.9,
      tours: 98,
      specialty: "Adventure Tours",
      price: 95,
      image: "👨‍🦱",
    },
  ];

  const preferences = [
    "Cultural Sites",
    "Museums",
    "Local Food",
    "Shopping",
    "Nightlife",
    "Nature/Parks",
    "Photography",
    "Adventure Activities",
    "Family-Friendly",
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const togglePreference = (pref) => {
    setBookingData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Choose Your Destination</h2>
            <p>Where would you like to explore?</p>

            <div className="popular-destinations">
              <h3>Popular Destinations</h3>
              <div className="destinations-grid">
                {destinations
                  .filter((d) => d.popular)
                  .map((dest) => (
                    <div
                      key={dest.id}
                      className={`destination-card ${
                        bookingData.destination === dest.name ? "selected" : ""
                      }`}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          destination: dest.name,
                        })
                      }
                    >
                      <div className="dest-image">{dest.image}</div>
                      <h4>{dest.name}</h4>
                    </div>
                  ))}
              </div>
            </div>

            <div className="other-destinations">
              <h3>Other Destinations</h3>
              <div className="destinations-grid">
                {destinations
                  .filter((d) => !d.popular)
                  .map((dest) => (
                    <div
                      key={dest.id}
                      className={`destination-card ${
                        bookingData.destination === dest.name ? "selected" : ""
                      }`}
                      onClick={() =>
                        setBookingData({
                          ...bookingData,
                          destination: dest.name,
                        })
                      }
                    >
                      <div className="dest-image">{dest.image}</div>
                      <h4>{dest.name}</h4>
                    </div>
                  ))}
              </div>
            </div>

            <div className="custom-destination">
              <h3>Can't find your destination?</h3>
              <input
                type="text"
                placeholder="Enter your destination"
                value={bookingData.destination}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    destination: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Select Your Guide</h2>
            <p>
              Choose from our verified local experts in{" "}
              {bookingData.destination}
            </p>

            <div className="guides-list">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className={`guide-card ${
                    bookingData.guide === guide.name ? "selected" : ""
                  }`}
                  onClick={() =>
                    setBookingData({ ...bookingData, guide: guide.name })
                  }
                >
                  <div className="guide-avatar">{guide.image}</div>
                  <div className="guide-info">
                    <h4>{guide.name}</h4>
                    <p className="guide-specialty">{guide.specialty}</p>
                    <div className="guide-stats">
                      <span className="rating">⭐ {guide.rating}</span>
                      <span className="tours">{guide.tours} tours</span>
                      <span className="price">${guide.price}/hour</span>
                    </div>
                  </div>
                  <div className="guide-actions">
                    <button className="view-profile">View Profile</button>
                    <button className="message-guide">💬 Message</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Tour Details</h2>
            <p>Let us know your preferences and travel dates</p>

            <div className="details-form">
              <div className="form-section">
                <h3>Travel Dates</h3>
                <div className="date-inputs">
                  <div className="input-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={bookingData.dates.start}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          dates: {
                            ...bookingData.dates,
                            start: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={bookingData.dates.end}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          dates: { ...bookingData.dates, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Number of Travelers</h3>
                <div className="travelers-selector">
                  <button
                    onClick={() =>
                      setBookingData({
                        ...bookingData,
                        travelers: Math.max(1, bookingData.travelers - 1),
                      })
                    }
                  >
                    -
                  </button>
                  <span>{bookingData.travelers}</span>
                  <button
                    onClick={() =>
                      setBookingData({
                        ...bookingData,
                        travelers: bookingData.travelers + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h3>Your Interests</h3>
                <div className="preferences-grid">
                  {preferences.map((pref) => (
                    <button
                      key={pref}
                      className={`preference-btn ${
                        bookingData.preferences.includes(pref) ? "selected" : ""
                      }`}
                      onClick={() => togglePreference(pref)}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Special Requests</h3>
                <textarea
                  placeholder="Any special requirements or requests for your tour..."
                  value={bookingData.specialRequests}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      specialRequests: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Review Your Booking</h2>
            <p>Please review your booking details before payment</p>

            <div className="booking-summary">
              <div className="summary-section">
                <h3>📍 Destination</h3>
                <p>{bookingData.destination}</p>
              </div>

              <div className="summary-section">
                <h3>👨‍🏫 Guide</h3>
                <p>{bookingData.guide}</p>
              </div>

              <div className="summary-section">
                <h3>📅 Dates</h3>
                <p>
                  {bookingData.dates.start} to {bookingData.dates.end}
                </p>
              </div>

              <div className="summary-section">
                <h3>👥 Travelers</h3>
                <p>
                  {bookingData.travelers}{" "}
                  {bookingData.travelers === 1 ? "person" : "people"}
                </p>
              </div>

              <div className="summary-section">
                <h3>🎯 Interests</h3>
                <div className="selected-preferences">
                  {bookingData.preferences.map((pref) => (
                    <span key={pref} className="pref-tag">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>

              {bookingData.specialRequests && (
                <div className="summary-section">
                  <h3>📝 Special Requests</h3>
                  <p>{bookingData.specialRequests}</p>
                </div>
              )}

              <div className="pricing-breakdown">
                <div className="price-line">
                  <span>Guide fee (3 days × $85/day)</span>
                  <span>$255</span>
                </div>
                <div className="price-line">
                  <span>Service fee</span>
                  <span>$25</span>
                </div>
                <div className="price-line total">
                  <span>Total</span>
                  <span>$280</span>
                </div>
              </div>

              <div className="payment-section">
                <h3>💳 Payment Method</h3>
                <div className="payment-options">
                  <button className="payment-btn selected">
                    💳 Credit Card
                  </button>
                  <button className="payment-btn">🏦 PayPal</button>
                  <button className="payment-btn">📱 Apple Pay</button>
                </div>
              </div>

              <button className="confirm-booking-btn">
                Confirm Booking & Pay $280
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-process-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Perfect Tour</h1>
          <div className="steps-indicator">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`step ${
                  currentStep >= step.number ? "active" : ""
                } ${currentStep === step.number ? "current" : ""}`}
              >
                <div className="step-icon">{step.icon}</div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="booking-content">{renderStep()}</div>

        <div className="booking-navigation">
          {currentStep > 1 && (
            <button onClick={prevStep} className="nav-btn prev">
              ← Previous
            </button>
          )}
          {currentStep < 4 && (
            <button
              onClick={nextStep}
              className="nav-btn next"
              disabled={
                (currentStep === 1 && !bookingData.destination) ||
                (currentStep === 2 && !bookingData.guide)
              }
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingProcessPage;
