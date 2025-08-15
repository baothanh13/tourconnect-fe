import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
//import { mockGuides, mockReviews } from "../data/mockData";
import Loading from "../components/Loading";
import "./TouristDashboard.css";

const TouristDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [userBookings, setUserBookings] = useState([]);
  const [favoriteGuides, setFavoriteGuides] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedTours: 0,
    upcomingTours: 0,
    totalSpent: 0,
    favoriteGuides: 0,
  });

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading user data for user:", user);

      // Check if user exists and has an ID
      if (!user || !user.id) {
        console.error("No user or user ID found");
        // Set some default/empty data to stop loading
        setUserBookings([]);
        setFavoriteGuides([]);
        setUserReviews([]);
        setStats({
          totalBookings: 0,
          completedTours: 0,
          upcomingTours: 0,
          totalSpent: 0,
          favoriteGuides: 0,
        });
        setProfileData({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          location: "",
          bio: "",
          avatar: "",
        });
        return;
      }

      console.log("Using mock data directly");

      const mockBookings = [
        {
          id: 1,
          guideId: 1,
          guideName: "Sarah Chen",
          guideImage: "/api/placeholder/60/60",
          location: "Tokyo, Japan",
          date: "2024-02-15",
          time: "10:00 AM",
          duration: "4 hours",
          tourType: "Cultural Tour",
          amount: 120,
          bookingCode: "TC001234",
          status: "confirmed",
          specialRequests: "Vegetarian lunch preferences",
        },
        {
          id: 2,
          guideId: 2,
          guideName: "Ahmed Hassan",
          guideImage: "/api/placeholder/60/60",
          location: "Cairo, Egypt",
          date: "2024-02-20",
          time: "2:00 PM",
          duration: "6 hours",
          tourType: "Historical Tour",
          amount: 90,
          bookingCode: "TC001235",
          status: "pending",
        },
      ];

      setUserBookings(mockBookings);
      setProfileData({
        name: user?.name || "Tourist User",
        email: user?.email || "user@example.com",
        phone: "+1-555-0123",
        location: "New York, USA",
        bio: "Travel enthusiast exploring the world",
        avatar: "/api/placeholder/100/100",
      });

      setStats({
        totalBookings: mockBookings.length,
        completedTours: mockBookings.filter((b) => b.status === "completed")
          .length,
        upcomingTours: mockBookings.filter(
          (b) => b.status === "confirmed" || b.status === "pending"
        ).length,
        totalSpent: mockBookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + b.amount, 0),
        favoriteGuides: 3,
      });

      console.log("Mock data loaded successfully");
    } catch (error) {
      console.error("Error loading user data:", error);
      // Set fallback data to prevent infinite loading
      setUserBookings([]);
      setFavoriteGuides([]);
      setUserReviews([]);
      setStats({
        totalBookings: 0,
        completedTours: 0,
        upcomingTours: 0,
        totalSpent: 0,
        favoriteGuides: 0,
      });
    } finally {
      console.log("Setting loading to false");
      setLoading(false);
    }
  }, [user?.id, user?.name, user?.email]);

  useEffect(() => {
    console.log("useEffect triggered with user:", user);
    if (user && (user.userType === "tourist" || user.role === "tourist")) {
      console.log("Loading data for tourist user");
      loadUserData();
    } else {
      console.log("User not tourist or no user");
      setLoading(false);
    }

    // Failsafe timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Timeout reached, stopping loading");
      setLoading(false);
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeoutId);
  }, [user, loadUserData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Replace with actual service call
      console.log("Profile update:", profileData);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    try {
      setLoading(true);
      // TODO: Replace with actual service call
      console.log("Password change:", passwordData);
      alert("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert("Error changing password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNewTour = () => {
    // Create a professional booking modal experience
    const tourTypes = [
      "Cultural Tours",
      "Food Tours",
      "Adventure Tours",
      "Historical Sites",
      "Photography Tours",
      "Nature Tours",
    ];

    const selectedType = prompt(
      `What type of tour are you interested in?\n\nOptions:\n${tourTypes
        .map((type, index) => `${index + 1}. ${type}`)
        .join("\n")}\n\nEnter number (1-${
        tourTypes.length
      }) or type your preference:`
    );

    if (selectedType) {
      const typeIndex = parseInt(selectedType) - 1;
      const tourType =
        typeIndex >= 0 && typeIndex < tourTypes.length
          ? tourTypes[typeIndex]
          : selectedType;

      alert(`Great choice! Searching for ${tourType} guides...`);
      window.open(`/guides?category=${encodeURIComponent(tourType)}`, "_blank");
    }
  };

  const handleFindGuide = () => {
    // Smart navigation based on user preferences
    if (favoriteGuides.length > 0) {
      setActiveTab("favorites");
    } else {
      const confirmBrowse = window.confirm(
        "You don't have any favorite guides yet. Would you like to browse available guides?"
      );
      if (confirmBrowse) {
        handleBrowseGuides();
      }
    }
  };

  const handleBrowseGuides = () => {
    // Open guides with user context preserved
    const userLocation = profileData.location || "your area";
    window.open(
      `/guides?location=${encodeURIComponent(userLocation)}`,
      "_blank"
    );
  };

  const handleViewGuideProfile = (guideId) => {
    // Open guide profile with booking context
    window.open(`/guides/${guideId}?source=dashboard`, "_blank");
  };

  const handleBookAgain = (guideId) => {
    const guide = favoriteGuides.find((g) => g.id === guideId);
    if (guide) {
      const options = [
        "Same type of tour",
        "Different tour experience",
        "Custom tour request",
      ];

      const choice = prompt(
        `Book another tour with ${guide.name}?\n\n${options
          .map((opt, i) => `${i + 1}. ${opt}`)
          .join("\n")}\n\nChoose option (1-3):`
      );

      if (choice) {
        const choiceIndex = parseInt(choice) - 1;
        const selectedOption = options[choiceIndex] || "custom tour";

        alert(
          `Excellent! Redirecting to book a ${selectedOption} with ${guide.name}...`
        );
        window.open(
          `/guides/${guideId}?booking_type=${encodeURIComponent(
            selectedOption
          )}`,
          "_blank"
        );
      }
    }
  };

  const handleLeaveReview = (bookingId) => {
    const booking = userBookings.find((b) => b.id === bookingId);
    if (booking) {
      const rating = prompt(
        `Rate your experience with ${booking.guideName} (1-5 stars):\n\n5 ⭐ Excellent\n4 ⭐ Very Good\n3 ⭐ Good\n2 ⭐ Fair\n1 ⭐ Poor\n\nEnter rating:`
      );

      if (rating && rating >= 1 && rating <= 5) {
        const comment = prompt(
          `Share your experience with ${booking.guideName}:\n\n(This will help other travelers and the guide improve their service)`
        );
        if (comment) {
          alert(
            "Thank you for your review! Your feedback helps our community grow."
          );

          // Add the review to the user's reviews list for immediate feedback
          const newReview = {
            id: Date.now(),
            rating: parseInt(rating),
            comment: comment,
            guideName: booking.guideName,
            date: new Date().toISOString(),
            bookingId: bookingId,
          };

          setUserReviews((prev) => [newReview, ...prev]);
          console.log("Review submitted:", newReview);
        }
      }
    }
  };

  const handleContactGuide = (bookingId) => {
    const booking = userBookings.find((b) => b.id === bookingId);
    if (booking) {
      const messageTypes = [
        "Ask about meeting point",
        "Discuss tour details",
        "Request tour customization",
        "Ask about weather/clothing",
        "Other question",
      ];

      const messageType = prompt(
        `Contact ${booking.guideName}:\n\n${messageTypes
          .map((type, i) => `${i + 1}. ${type}`)
          .join("\n")}\n\nChoose topic (1-5) or type your message:`
      );

      if (messageType) {
        const typeIndex = parseInt(messageType) - 1;
        let message;

        if (typeIndex >= 0 && typeIndex < messageTypes.length) {
          message = prompt(
            `${messageTypes[typeIndex]}:\n\nPlease provide details:`
          );
        } else {
          message = messageType;
        }

        if (message) {
          alert(
            `Message sent to ${booking.guideName}! They will respond soon.`
          );
          console.log("Message sent:", { bookingId, messageType, message });
        }
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        setLoading(true);
        const reason = prompt("Please provide a reason for cancellation:");
        if (reason) {
          // TODO: Replace with actual service call
          console.log("Cancel booking:", bookingId, reason);
          alert("Booking cancelled successfully!");
          loadUserData(); // Reload data
        }
      } catch (error) {
        alert("Error cancelling booking: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loading size="large" text="Loading your dashboard..." overlay />;
  }

  // If no user or not a tourist, show access denied
  if (!user) {
    return (
      <div className="tourist-dashboard">
        <div className="dashboard-container">
          <div className="access-denied">
            <h2>Please log in</h2>
            <p>
              You need to be logged in as a tourist to access this dashboard.
            </p>
            <a href="/login" className="btn btn-primary">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (user.userType !== "tourist" && user.role !== "tourist") {
    return (
      <div className="tourist-dashboard">
        <div className="dashboard-container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>This dashboard is only accessible to tourists.</p>
            <p>Current user type: {user.userType || user.role || "unknown"}</p>
            <a href="/" className="btn btn-primary">
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tourist-dashboard">
      {/* Dashboard Hero Section */}
      <div className="dashboard-hero">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.name || "Traveler"}!</h1>
            <p>
              Ready for your next adventure? Explore your travel journey and
              manage your bookings.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-container">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.completedTours}</div>
              <div className="stat-label">Completed Tours</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.upcomingTours}</div>
              <div className="stat-label">Upcoming Tours</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">${stats.totalSpent}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.favoriteGuides}</div>
              <div className="stat-label">Favorite Guides</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📅 My Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            ❤️ Favorite Guides
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            ⭐ My Reviews
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content-wrapper">
          {activeTab === "overview" && (
            <div className="tab-content">
              <div className="content-grid">
                <div className="content-card">
                  <h3>📈 Travel Statistics</h3>
                  <div className="stats-list">
                    <div className="stat-row">
                      <span>Total Bookings:</span>
                      <span className="stat-value">{stats.totalBookings}</span>
                    </div>
                    <div className="stat-row">
                      <span>Completed Tours:</span>
                      <span className="stat-value">{stats.completedTours}</span>
                    </div>
                    <div className="stat-row">
                      <span>Upcoming Tours:</span>
                      <span className="stat-value">{stats.upcomingTours}</span>
                    </div>
                    <div className="stat-row">
                      <span>Total Spent:</span>
                      <span className="stat-value">${stats.totalSpent}</span>
                    </div>
                    <div className="stat-row">
                      <span>Favorite Guides:</span>
                      <span className="stat-value">{stats.favoriteGuides}</span>
                    </div>
                  </div>
                </div>

                <div className="content-card">
                  <h3>🗓️ Recent Bookings</h3>
                  <div className="recent-list">
                    {userBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="recent-item">
                        <div className="item-info">
                          <strong>{booking.guideName}</strong>
                          <span>{booking.location}</span>
                          <span>
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`status-badge ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </div>
                      </div>
                    ))}
                    {userBookings.length === 0 && (
                      <div className="empty-state">
                        <p>No bookings yet.</p>
                        <button
                          onClick={handleFindGuide}
                          className="action-link"
                        >
                          Explore Guides!
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="content-card">
                  <h3>🌟 Recent Reviews</h3>
                  <div className="recent-list">
                    {userReviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="recent-item">
                        <div className="review-rating">
                          {"⭐".repeat(review.rating)}
                        </div>
                        <p className="review-text">
                          {review.comment.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                    {userReviews.length === 0 && (
                      <div className="empty-state">
                        <p>No reviews yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="tab-content">
              <div className="bookings-section">
                <div className="section-header">
                  <h2>My Bookings</h2>
                  <button
                    onClick={handleBookNewTour}
                    className="btn btn-primary"
                  >
                    Book New Tour
                  </button>
                </div>

                <div className="bookings-grid">
                  {userBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-header">
                        <div className="guide-info">
                          <img
                            src={booking.guideImage}
                            alt={booking.guideName}
                            className="guide-avatar"
                          />
                          <div>
                            <h3>{booking.guideName}</h3>
                            <p>{booking.location}</p>
                          </div>
                        </div>
                        <div className={`booking-status ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </div>
                      </div>

                      <div className="booking-details">
                        <div className="detail-row">
                          <span>📅 Date:</span>
                          <span>
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span>⏰ Time:</span>
                          <span>{booking.time}</span>
                        </div>
                        <div className="detail-row">
                          <span>⏱️ Duration:</span>
                          <span>{booking.duration}</span>
                        </div>
                        <div className="detail-row">
                          <span>🎯 Tour Type:</span>
                          <span>{booking.tourType}</span>
                        </div>
                        <div className="detail-row">
                          <span>💰 Amount:</span>
                          <span>${booking.amount}</span>
                        </div>
                        <div className="detail-row">
                          <span>🎫 Booking Code:</span>
                          <span>{booking.bookingCode}</span>
                        </div>
                        {booking.specialRequests && (
                          <div className="detail-row">
                            <span>📝 Special Requests:</span>
                            <span>{booking.specialRequests}</span>
                          </div>
                        )}
                      </div>

                      <div className="booking-actions">
                        {booking.status === "pending" && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleContactGuide(booking.id)}
                            >
                              Contact Guide
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === "completed" && (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleLeaveReview(booking.id)}
                          >
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {userBookings.length === 0 && (
                    <div className="no-bookings">
                      <h3>No bookings yet</h3>
                      <p>Start exploring and book your first tour!</p>
                      <button
                        onClick={handleBrowseGuides}
                        className="btn btn-primary"
                      >
                        Browse Guides
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="tab-content">
              <div className="profile-section">
                <div className="profile-grid">
                  <div className="profile-card">
                    <h3>Personal Information</h3>
                    <form onSubmit={handleProfileUpdate}>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          rows="4"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Update Profile
                      </button>
                    </form>
                  </div>

                  <div className="profile-card">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="tab-content">
              <div className="favorites-section">
                <h2>Favorite Guides</h2>
                <div className="guides-grid">
                  {favoriteGuides.map((guide) => (
                    <div key={guide.id} className="guide-card">
                      <img src={guide.avatar} alt={guide.name} />
                      <div className="guide-info">
                        <h3>{guide.name}</h3>
                        <p>{guide.location}</p>
                        <div className="guide-rating">
                          ⭐ {guide.rating} ({guide.totalReviews} reviews)
                        </div>
                        <div className="guide-price">
                          ${guide.pricePerHour}/hour
                        </div>
                      </div>
                      <div className="guide-actions">
                        <button
                          onClick={() => handleViewGuideProfile(guide.id)}
                          className="btn btn-primary"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleBookAgain(guide.id)}
                          className="btn btn-secondary"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  ))}

                  {favoriteGuides.length === 0 && (
                    <div className="no-favorites">
                      <h3>No favorite guides yet</h3>
                      <p>
                        Book tours with guides to add them to your favorites!
                      </p>
                      <button
                        onClick={handleBrowseGuides}
                        className="btn btn-primary"
                      >
                        Browse Guides
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="tab-content">
              <div className="reviews-section">
                <h2>My Reviews</h2>
                <div className="reviews-list">
                  {userReviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="review-rating">
                          {"⭐".repeat(review.rating)}
                        </div>
                        <div className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-guide">
                        Review for: <strong>{review.guideName}</strong>
                      </div>
                    </div>
                  ))}

                  {userReviews.length === 0 && (
                    <div className="no-reviews">
                      <h3>No reviews yet</h3>
                      <p>Complete tours to leave reviews for your guides!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
