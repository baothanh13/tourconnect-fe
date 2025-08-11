import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { mockBookings, mockGuides } from "../data/mockData";
import "./GuideDashboard.css";
import { guidesService } from "../services/guidesService";
import { bookingsService } from "../services/bookingsService";
import Loading from "../components/Loading";
import "./GuideDashboard.css";

const GuideDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [guideData, setGuideData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tourForm, setTourForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    maxGuests: "",
    includes: "",
    excludes: "",
    itinerary: "",
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedTours: 0,
    totalEarnings: 0,
    averageRating: 0,
    upcomingTours: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    if (user && user.role === "guide") {
      loadGuideData();
    }
  }, [user]);

  const loadGuideData = async () => {
    try {
      setLoading(true);

      // Load guide profile by user ID
      const guide = await guidesService.getGuideByUserId(user.user_id);
      setGuideData(guide);

      // Load guide bookings
      const guideBookings = await bookingsService.getGuideBookings(
        user.user_id
      );
      setBookings(guideBookings);

      // Calculate stats
      const completedCount = guideBookings.filter(
        (b) => b.status === "completed"
      ).length;
      const totalEarnings = guideBookings
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + b.amount, 0);
      const upcomingCount = guideBookings.filter(
        (b) => b.status === "confirmed" && new Date(b.date) > new Date()
      ).length;
      const pendingCount = guideBookings.filter(
        (b) => b.status === "pending"
      ).length;

      setStats({
        totalBookings: guideBookings.length,
        completedTours: completedCount,
        totalEarnings,
        averageRating: guide.rating || 0,
        upcomingTours: upcomingCount,
        pendingRequests: pendingCount,
      });
    } catch (error) {
      console.error("Error loading guide data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action, notes = "") => {
    try {
      setLoading(true);
      if (action === "confirm") {
        await bookingsService.confirmBooking(bookingId, notes);
        alert("Booking confirmed successfully!");
      } else if (action === "reject") {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason) {
          await bookingsService.updateBookingStatus(
            bookingId,
            "rejected",
            reason
          );
          alert("Booking rejected.");
        }
      } else if (action === "complete") {
        await bookingsService.completeBooking(bookingId, { notes });
        alert("Tour completed successfully!");
      }
      loadGuideData(); // Reload data
    } catch (error) {
      alert("Error updating booking: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // This would integrate with a tours service
      console.log("Creating tour:", tourForm);
      alert("Tour created successfully!");
      setTourForm({
        title: "",
        description: "",
        price: "",
        duration: "",
        location: "",
        maxGuests: "",
        includes: "",
        excludes: "",
        itinerary: "",
      });
    } catch (error) {
      alert("Error creating tour: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading size="large" text="Loading your guide dashboard..." overlay />
    );
  }

  // Check if user is authenticated and is a guide
  if (!user) {
    return (
      <div className="guide-dashboard">
        <div className="container">
          <div className="access-denied">
            <h2>Please log in</h2>
            <p>You need to be logged in as a guide to access this dashboard.</p>
            <a href="/login" className="btn btn-primary">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (user.userType !== "guide" && user.role !== "guide") {
    return (
      <div className="guide-dashboard">
        <div className="container">
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>This dashboard is only accessible to registered tour guides.</p>
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
    <div className="guide-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="guide-welcome">
            <div className="guide-avatar">
              {guideData?.image ? (
                <img src={guideData.image} alt="Guide Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0)?.toUpperCase() || "G"}
                </div>
              )}
            </div>
            <div className="welcome-text">
              <h1>Welcome, {user?.name || "Guide"}!</h1>
              <p>Manage your tours and help travelers explore</p>
              <div className="verification-status">
                {guideData?.isVerified ? (
                  <span className="verified">✅ Verified Guide</span>
                ) : (
                  <span className="pending">⏳ Verification Pending</span>
                )}
              </div>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingRequests}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">${stats.totalEarnings}</div>
              <div className="stat-label">Total Earnings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        <button
          className={activeTab === "overview" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === "bookings" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("bookings")}
        >
          📅 Booking Requests
        </button>
        <button
          className={activeTab === "tours" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("tours")}
        >
          🗺️ My Tours
        </button>
        <button
          className={activeTab === "earnings" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("earnings")}
        >
          💰 Earnings
        </button>
        <button
          className={activeTab === "messages" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("messages")}
        >
          💬 Messages
        </button>
        <button
          className={activeTab === "reviews" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("reviews")}
        >
          ⭐ Reviews
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📈 Performance Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span>Total Bookings:</span>
                    <span>{stats.totalBookings}</span>
                  </div>
                  <div className="stat-item">
                    <span>Completed Tours:</span>
                    <span>{stats.completedTours}</span>
                  </div>
                  <div className="stat-item">
                    <span>Upcoming Tours:</span>
                    <span>{stats.upcomingTours}</span>
                  </div>
                  <div className="stat-item">
                    <span>Pending Requests:</span>
                    <span>{stats.pendingRequests}</span>
                  </div>
                  <div className="stat-item">
                    <span>Total Earnings:</span>
                    <span>${stats.totalEarnings}</span>
                  </div>
                  <div className="stat-item">
                    <span>Average Rating:</span>
                    <span>{stats.averageRating.toFixed(1)} ⭐</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>🗓️ Recent Booking Requests</h3>
                <div className="recent-bookings">
                  {bookings
                    .filter((b) => b.status === "pending")
                    .slice(0, 3)
                    .map((booking) => (
                      <div key={booking.id} className="booking-summary">
                        <div className="booking-info">
                          <strong>{booking.touristName}</strong>
                          <span>
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span>${booking.amount}</span>
                        </div>
                        <div className="booking-actions">
                          <button
                            className="btn-small btn-success"
                            onClick={() =>
                              handleBookingAction(booking.id, "confirm")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="btn-small btn-danger"
                            onClick={() =>
                              handleBookingAction(booking.id, "reject")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  {bookings.filter((b) => b.status === "pending").length ===
                    0 && <p className="no-data">No pending requests.</p>}
                </div>
              </div>

              <div className="overview-card">
                <h3>📅 Upcoming Tours</h3>
                <div className="upcoming-tours">
                  {bookings
                    .filter(
                      (b) =>
                        b.status === "confirmed" &&
                        new Date(b.date) > new Date()
                    )
                    .slice(0, 3)
                    .map((booking) => (
                      <div key={booking.id} className="tour-summary">
                        <div className="tour-info">
                          <strong>{booking.touristName}</strong>
                          <span>
                            {new Date(booking.date).toLocaleDateString()}
                          </span>
                          <span>{booking.time}</span>
                          <span>{booking.tourType}</span>
                        </div>
                        <button
                          className="btn-small btn-primary"
                          onClick={() =>
                            handleBookingAction(booking.id, "complete")
                          }
                        >
                          Mark Complete
                        </button>
                      </div>
                    ))}
                  {bookings.filter(
                    (b) =>
                      b.status === "confirmed" && new Date(b.date) > new Date()
                  ).length === 0 && (
                    <p className="no-data">No upcoming tours.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Booking Requests</h2>
              <div className="booking-filters">
                <select>
                  <option>All Requests</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="tourist-info">
                      <div className="tourist-avatar">
                        {booking.touristName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{booking.touristName}</h3>
                        <p>{booking.touristEmail}</p>
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
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
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
                      <span>👥 Group Size:</span>
                      <span>{booking.groupSize} people</span>
                    </div>
                    <div className="detail-row">
                      <span>🎯 Tour Type:</span>
                      <span>{booking.tourType}</span>
                    </div>
                    <div className="detail-row">
                      <span>💰 Amount:</span>
                      <span>${booking.amount}</span>
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
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleBookingAction(booking.id, "confirm")
                          }
                        >
                          Accept Request
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleBookingAction(booking.id, "reject")
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <>
                        <button className="btn btn-secondary">
                          Contact Tourist
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleBookingAction(booking.id, "complete")
                          }
                        >
                          Mark Complete
                        </button>
                      </>
                    )}
                    {booking.status === "completed" && (
                      <button className="btn btn-info">View Details</button>
                    )}
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="no-bookings">
                  <h3>No booking requests yet</h3>
                  <p>Enhance your profile to attract more tourists!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tours" && (
          <div className="tours-section">
            <div className="section-header">
              <h2>My Tours</h2>
              <button
                className="btn btn-primary"
                onClick={() =>
                  (document.getElementById("create-tour-form").style.display =
                    "block")
                }
              >
                Create New Tour
              </button>
            </div>

            <div
              id="create-tour-form"
              className="tour-form-modal"
              style={{ display: "none" }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Create New Tour</h3>
                  <button
                    className="close-btn"
                    onClick={() =>
                      (document.getElementById(
                        "create-tour-form"
                      ).style.display = "none")
                    }
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleCreateTour} className="tour-form">
                  <div className="form-group">
                    <label>Tour Title</label>
                    <input
                      type="text"
                      value={tourForm.title}
                      onChange={(e) =>
                        setTourForm({ ...tourForm, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={tourForm.description}
                      onChange={(e) =>
                        setTourForm({
                          ...tourForm,
                          description: e.target.value,
                        })
                      }
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price ($)</label>
                      <input
                        type="number"
                        value={tourForm.price}
                        onChange={(e) =>
                          setTourForm({ ...tourForm, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={tourForm.duration}
                        onChange={(e) =>
                          setTourForm({ ...tourForm, duration: e.target.value })
                        }
                        placeholder="e.g., 4 hours"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={tourForm.location}
                        onChange={(e) =>
                          setTourForm({ ...tourForm, location: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Max Guests</label>
                      <input
                        type="number"
                        value={tourForm.maxGuests}
                        onChange={(e) =>
                          setTourForm({
                            ...tourForm,
                            maxGuests: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>What's Included</label>
                    <textarea
                      value={tourForm.includes}
                      onChange={(e) =>
                        setTourForm({ ...tourForm, includes: e.target.value })
                      }
                      rows="3"
                      placeholder="e.g., Transportation, Guide, Lunch"
                    />
                  </div>

                  <div className="form-group">
                    <label>What's Excluded</label>
                    <textarea
                      value={tourForm.excludes}
                      onChange={(e) =>
                        setTourForm({ ...tourForm, excludes: e.target.value })
                      }
                      rows="3"
                      placeholder="e.g., Personal expenses, Tips"
                    />
                  </div>

                  <div className="form-group">
                    <label>Itinerary</label>
                    <textarea
                      value={tourForm.itinerary}
                      onChange={(e) =>
                        setTourForm({ ...tourForm, itinerary: e.target.value })
                      }
                      rows="5"
                      placeholder="Detailed tour itinerary..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Create Tour
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        (document.getElementById(
                          "create-tour-form"
                        ).style.display = "none")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="tours-grid">
              <div className="tour-card">
                <div className="tour-image">
                  <img
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=300&fit=crop"
                    alt="Cultural Tour"
                  />
                </div>
                <div className="tour-info">
                  <h3>Cultural Heritage Tour</h3>
                  <p>
                    Explore the rich cultural heritage of Hoi An with ancient
                    temples and traditional crafts.
                  </p>
                  <div className="tour-meta">
                    <span>⏱️ 4 hours</span>
                    <span>👥 Max 8 people</span>
                    <span>💰 $45</span>
                  </div>
                  <div className="tour-stats">
                    <span>📅 12 bookings</span>
                    <span>⭐ 4.9 rating</span>
                  </div>
                </div>
                <div className="tour-actions">
                  <button className="btn btn-secondary">Edit</button>
                  <button className="btn btn-info">View</button>
                  <button className="btn btn-danger">Delete</button>
                </div>
              </div>

              <div className="create-tour-card">
                <div className="create-tour-content">
                  <h3>Create Your First Tour</h3>
                  <p>Start sharing your local expertise with travelers</p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      (document.getElementById(
                        "create-tour-form"
                      ).style.display = "block")
                    }
                  >
                    + Create Tour
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="earnings-section">
            <div className="section-header">
              <h2>Earnings Dashboard</h2>
              <div className="earnings-period">
                <select>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            <div className="earnings-overview">
              <div className="earnings-card">
                <h3>Total Earnings</h3>
                <div className="amount">${stats.totalEarnings}</div>
                <div className="change">+12% from last month</div>
              </div>

              <div className="earnings-card">
                <h3>Pending Payouts</h3>
                <div className="amount">$245</div>
                <div className="payout-date">Next payout: Jan 30</div>
              </div>

              <div className="earnings-card">
                <h3>Average per Tour</h3>
                <div className="amount">
                  ${stats.totalEarnings / (stats.completedTours || 1)}
                </div>
                <div className="tours">
                  From {stats.completedTours} completed tours
                </div>
              </div>
            </div>

            <div className="earnings-breakdown">
              <h3>Recent Earnings</h3>
              <div className="earnings-list">
                {bookings
                  .filter((b) => b.status === "completed")
                  .map((booking) => (
                    <div key={booking.id} className="earning-item">
                      <div className="earning-info">
                        <span className="tourist-name">
                          {booking.touristName}
                        </span>
                        <span className="tour-date">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                        <span className="tour-type">{booking.tourType}</span>
                      </div>
                      <div className="earning-amount">+${booking.amount}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="messages-section">
            <div className="section-header">
              <h2>Messages</h2>
              <div className="message-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Unread</button>
                <button className="filter-btn">Booking Related</button>
              </div>
            </div>

            <div className="messages-list">
              <div className="message-item unread">
                <div className="message-avatar">S</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">Sarah Johnson</span>
                    <span className="message-time">2 hours ago</span>
                  </div>
                  <div className="message-preview">
                    Hi! I have a question about the cultural tour on Jan 25...
                  </div>
                </div>
                <div className="message-badge">2</div>
              </div>

              <div className="message-item">
                <div className="message-avatar">M</div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="sender-name">Michael Chen</span>
                    <span className="message-time">1 day ago</span>
                  </div>
                  <div className="message-preview">
                    Thank you for the amazing tour! I really enjoyed it.
                  </div>
                </div>
              </div>

              <div className="empty-messages">
                <p>
                  Start conversations with your tourists to provide better
                  service!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-section">
            <div className="section-header">
              <h2>Customer Reviews</h2>
              <div className="rating-summary">
                <div className="average-rating">
                  <span className="rating-number">
                    {stats.averageRating.toFixed(1)}
                  </span>
                  <div className="rating-stars">
                    {"⭐".repeat(Math.round(stats.averageRating))}
                  </div>
                  <span className="rating-count">
                    Based on {stats.completedTours} reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="reviews-list">
              <div className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">S</div>
                    <div>
                      <div className="reviewer-name">Sarah Johnson</div>
                      <div className="review-date">January 15, 2024</div>
                    </div>
                  </div>
                  <div className="review-rating">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="review-content">
                  <p>
                    Amazing tour! Lan showed us hidden gems in Hoi An that we
                    never would have found on our own. Her knowledge of local
                    history and culture made the experience truly special.
                    Highly recommended!
                  </p>
                </div>
                <div className="review-tour">Cultural Heritage Tour</div>
              </div>

              <div className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">M</div>
                    <div>
                      <div className="reviewer-name">Michael Chen</div>
                      <div className="review-date">January 10, 2024</div>
                    </div>
                  </div>
                  <div className="review-rating">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="review-content">
                  <p>
                    Excellent food tour! We tried authentic local dishes and
                    learned about Vietnamese cooking techniques. The guide was
                    very knowledgeable and friendly.
                  </p>
                </div>
                <div className="review-tour">Food Discovery Tour</div>
              </div>

              {stats.completedTours === 0 && (
                <div className="no-reviews">
                  <h3>No reviews yet</h3>
                  <p>
                    Complete tours to start receiving reviews from tourists!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedTours}</h3>
            <p>Completed Tours</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalEarnings}</h3>
            <p>Total Earnings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{stats.averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗓️</div>
          <div className="stat-content">
            <h3>{stats.upcomingTours}</h3>
            <p>Upcoming Tours</p>
          </div>
        </div>
      </div>

      <div className="recent-bookings">
        <h3>Recent Booking Requests</h3>
        <div className="bookings-list">
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <h4>Tour Booking #{booking.id}</h4>
                <p>
                  📅 {booking.date} at {booking.timeSlot}
                </p>
                <p>👥 {booking.numberOfPeople} people</p>
                <p>💵 ${booking.totalPrice}</p>
              </div>
              <div className="booking-status">
                <span className={`status-badge ${booking.status}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bookings-section">
      <div className="bookings-header">
        <h3>Manage Bookings</h3>
        <div className="booking-filters">
          <select className="filter-select">
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bookings-table">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-row">
            <div className="booking-details">
              <div className="booking-main">
                <h4>Booking #{booking.id}</h4>
                <p className="booking-date">
                  📅 {booking.date} at {booking.timeSlot}
                </p>
              </div>
              <div className="booking-meta">
                <p>👥 {booking.numberOfPeople} guests</p>
                <p>💰 ${booking.totalPrice}</p>
                <p>📝 {booking.specialRequests || "No special requests"}</p>
              </div>
            </div>
            <div className="booking-actions">
              <span className={`status-badge ${booking.status}`}>
                {booking.status.toUpperCase()}
              </span>
              {booking.status === "pending" && (
                <div className="action-buttons">
                  <button
                    onClick={() => handleBookingAction(booking.id, "confirmed")}
                    className="btn-confirm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBookingAction(booking.id, "cancelled")}
                    className="btn-reject"
                  >
                    Decline
                  </button>
                </div>
              )}
              {booking.status === "confirmed" && (
                <button
                  onClick={() => handleBookingAction(booking.id, "completed")}
                  className="btn-complete"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="calendar-section">
      <div className="calendar-header">
        <h3>Calendar Management</h3>
        <button className="btn-primary">Set Availability</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-placeholder">
          <h4>📅 Calendar View</h4>
          <p>Calendar functionality will be implemented here</p>
          <div className="upcoming-schedule">
            <h5>This Week's Schedule:</h5>
            {bookings
              .filter((b) => b.status === "confirmed")
              .slice(0, 5)
              .map((booking) => (
                <div key={booking.id} className="schedule-item">
                  <span className="schedule-date">{booking.date}</span>
                  <span className="schedule-time">{booking.timeSlot}</span>
                  <span className="schedule-guests">
                    {booking.numberOfPeople} guests
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <div className="profile-header">
        <h3>Profile Management</h3>
        <button className="btn-primary">Edit Profile</button>
      </div>

      {guideData && (
        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-avatar">
              <img src={guideData.avatar} alt={guideData.name} />
              <button className="change-photo-btn">Change Photo</button>
            </div>
            <div className="profile-info">
              <h4>{guideData.name}</h4>
              <p>📍 {guideData.location}</p>
              <p>
                ⭐ {guideData.rating} ({guideData.totalReviews} reviews)
              </p>
              <p>💼 {guideData.experienceYears} years experience</p>
              <p>💵 ${guideData.pricePerHour}/hour</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-section">
              <h5>About Me</h5>
              <p>{guideData.bio}</p>
            </div>

            <div className="detail-section">
              <h5>Specialties</h5>
              <div className="specialties-tags">
                {guideData.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h5>Languages</h5>
              <div className="languages-list">
                {guideData.languages.map((language, index) => (
                  <span key={index} className="language-tag">
                    {language}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h5>Contact Information</h5>
              <p>📧 {guideData.email}</p>
              <p>📱 {guideData.phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
