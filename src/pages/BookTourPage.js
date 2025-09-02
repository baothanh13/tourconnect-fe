import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./BookTourPage.css";

const BookTourPage = () => {
  const { isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState({
    guideId: "",
    date: "",
    time: "",
    duration: "2",
    numberOfTourists: "1",
    specialRequests: "",
  });
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    // Mock guides data
    const mockGuides = [
      {
        id: 1,
        name: "Sarah Chen",
        location: "Ho Chi Minh City",
        avatar: "/api/placeholder/100/100",
        rating: 4.8,
        pricePerHour: 25,
        specialties: ["Cultural Tours", "Food Tours"],
        availability: "Available today",
      },
      {
        id: 2,
        name: "Ahmed Hassan",
        location: "Hanoi",
        avatar: "/api/placeholder/100/100",
        rating: 4.9,
        pricePerHour: 30,
        specialties: ["Historical Sites", "Architecture"],
        availability: "Available tomorrow",
      },
      {
        id: 3,
        name: "Maria Santos",
        location: "Da Nang",
        avatar: "/api/placeholder/100/100",
        rating: 4.7,
        pricePerHour: 22,
        specialties: ["Beach Tours", "Adventure Tours"],
        availability: "Available today",
      },
    ];
    setGuides(mockGuides);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuideSelect = (guide) => {
    setSelectedGuide(guide);
    setBookingData((prev) => ({
      ...prev,
      guideId: guide.id,
    }));
  };

  const calculateTotal = () => {
    if (!selectedGuide || !bookingData.duration) return 0;
    return selectedGuide.pricePerHour * parseInt(bookingData.duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please login to book a tour");
      return;
    }

    setLoading(true);

    try {
      // Mock booking submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        "Booking request submitted successfully! You will receive a confirmation email shortly."
      );

      // Reset form
      setBookingData({
        guideId: "",
        date: "",
        time: "",
        duration: "2",
        numberOfTourists: "1",
        specialRequests: "",
      });
      setSelectedGuide(null);
    } catch (error) {
      alert("Error submitting booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="book-tour-page">
      <div className="page-header">
        <div className="container">
          <h1>Book Your Tour</h1>
          <p>Choose a guide and plan your perfect experience</p>
        </div>
      </div>

      <div className="container">
        <div className="booking-content">
          {!isAuthenticated && (
            <div className="login-notice">
              <h3>Please Login to Book</h3>
              <p>
                You need to be logged in to book a tour. Please login or
                register first.
              </p>
              <div className="auth-links">
                <a href="/login" className="login-btn">
                  Login
                </a>
                <a href="/register" className="register-btn">
                  Register
                </a>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <>
              {/* Guide Selection */}
              <div className="guide-selection">
                <h2>Step 1: Choose Your Guide</h2>
                <div className="guides-grid">
                  {guides.map((guide) => (
                    <div
                      key={guide.id}
                      className={`guide-option ${
                        selectedGuide?.id === guide.id ? "selected" : ""
                      }`}
                      onClick={() => handleGuideSelect(guide)}
                    >
                      <img src={guide.avatar} alt={guide.name} />
                      <div className="guide-details">
                        <h3>{guide.name}</h3>
                        <p className="location">📍 {guide.location}</p>
                        <div className="rating">★ {guide.rating}</div>
                        <div className="price">${guide.pricePerHour}/hour</div>
                        <div className="availability">{guide.availability}</div>
                        <div className="specialties">
                          {guide.specialties.map((specialty) => (
                            <span key={specialty} className="specialty">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Form */}
              {selectedGuide && (
                <div className="booking-form-section">
                  <h2>Step 2: Book Your Tour</h2>

                  <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="date"
                          name="date"
                          value={bookingData.date}
                          onChange={handleInputChange}
                          min={minDate}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Time</label>
                        <select
                          name="time"
                          value={bookingData.time}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select time</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Duration (hours)</label>
                        <select
                          name="duration"
                          value={bookingData.duration}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="2">2 hours</option>
                          <option value="3">3 hours</option>
                          <option value="4">4 hours</option>
                          <option value="6">6 hours</option>
                          <option value="8">8 hours</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Number of Tourists</label>
                        <select
                          name="numberOfTourists"
                          value={bookingData.numberOfTourists}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="1">1 person</option>
                          <option value="2">2 people</option>
                          <option value="3">3 people</option>
                          <option value="4">4 people</option>
                          <option value="5">5 people</option>
                          <option value="6">6+ people</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Special Requests (Optional)</label>
                      <textarea
                        name="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests or preferences..."
                        rows="4"
                      />
                    </div>

                    {/* Booking Summary */}
                    <div className="booking-summary">
                      <h3>Booking Summary</h3>
                      <div className="summary-item">
                        <span>Guide:</span>
                        <span>{selectedGuide.name}</span>
                      </div>
                      <div className="summary-item">
                        <span>Duration:</span>
                        <span>{bookingData.duration} hours</span>
                      </div>
                      <div className="summary-item">
                        <span>Rate per hour:</span>
                        <span>${selectedGuide.pricePerHour}</span>
                      </div>
                      <div className="summary-item total">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="submit-booking-btn"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Booking Request"}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTourPage;
