import React, { useState, useEffect } from "react";
import { guidesService } from "../../services/guidesService";
import { toursService } from "../../services/toursService";
import { bookingsService } from "../../services/bookingsService";
import Loading from "../Loading";
import { FaTour, FaCalendarAlt, FaStar } from "react-icons/fa";
import "./GuideManagement.css";

const GuideProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [guideProfile, setGuideProfile] = useState(null);
  const [guideTours, setGuideTours] = useState([]);
  const [guideBookings, setGuideBookings] = useState([]);
  const [error, setError] = useState(null);

  // Mock user ID for testing - replace with actual user context
  const userId = "test-user-id";

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch guide profile
        const profile = await guidesService.getGuideByUserId(userId);
        setGuideProfile(profile);

        if (profile && profile.id) {
          // Fetch tours and bookings for this guide
          const [tours, bookings] = await Promise.all([
            toursService.getToursByGuide(profile.id),
            bookingsService
              .getGuideBookings(profile.id)
              .catch(() => ({ bookings: [] })),
          ]);

          setGuideTours(tours.tours || []);
          setGuideBookings(bookings.bookings || []);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="guide-profile-manager">
      <h2>Guide Profile Test</h2>

      {error && (
        <div
          className="error-message"
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {guideProfile ? (
        <div className="guide-data">
          <div className="profile-section">
            <h3>Profile Information</h3>
            <p>
              <strong>ID:</strong> {guideProfile.id}
            </p>
            <p>
              <strong>Name:</strong> {guideProfile.name}
            </p>
            <p>
              <strong>Email:</strong> {guideProfile.email}
            </p>
            <p>
              <strong>Location:</strong> {guideProfile.location}
            </p>
            <p>
              <strong>Languages:</strong>{" "}
              {Array.isArray(guideProfile.languages)
                ? guideProfile.languages.join(", ")
                : guideProfile.languages}
            </p>
            <p>
              <strong>Experience:</strong> {guideProfile.experience_years} years
            </p>
            <p>
              <strong>Status:</strong> {guideProfile.verification_status}
            </p>
          </div>

          <div className="stats-section">
            <h3>Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <FaTour />
                <div>
                  <span className="stat-number">{guideTours.length}</span>
                  <span className="stat-label">Tours</span>
                </div>
              </div>
              <div className="stat-card">
                <FaCalendarAlt />
                <div>
                  <span className="stat-number">{guideBookings.length}</span>
                  <span className="stat-label">Bookings</span>
                </div>
              </div>
              <div className="stat-card">
                <FaStar />
                <div>
                  <span className="stat-number">
                    {guideProfile.rating || 0}
                  </span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tours-section">
            <h3>Tours ({guideTours.length})</h3>
            {guideTours.length > 0 ? (
              <ul>
                {guideTours.map((tour) => (
                  <li key={tour.id}>
                    <strong>{tour.title}</strong> - ${tour.price} (
                    {tour.category})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tours found</p>
            )}
          </div>

          <div className="bookings-section">
            <h3>Bookings ({guideBookings.length})</h3>
            {guideBookings.length > 0 ? (
              <ul>
                {guideBookings.map((booking) => (
                  <li key={booking.id}>
                    Date: {booking.date} - Status: {booking.status} - $
                    {booking.total_price}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings found</p>
            )}
          </div>
        </div>
      ) : (
        <div className="no-profile">
          <p>No guide profile found for this user.</p>
          <p>This could mean:</p>
          <ul>
            <li>The user hasn't completed guide registration</li>
            <li>The guide profile API endpoint is not working</li>
            <li>The user ID is incorrect</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GuideProfileManager;
