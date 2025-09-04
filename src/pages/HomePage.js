import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { guidesService } from "../services/guidesService";
import { toursService } from "../services/toursService";
import { adminService } from "../services/adminService";
import {
  GuidePreviewCard,
  TourPreviewCard,
  StatCard,
  BookingActivityCard,
} from "../components/HomepageCards";
import Loading from "../components/Loading";
import {
  FaUsers,
  FaUserTie,
  FaRoute,
  FaHandshake,
  FaArrowRight,
  FaPlay,
} from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDates, setSearchDates] = useState("");
  // const [stats] = useState({
  //   tourists: 10000,
  //   guides: 500,
  //   tours: 1500,
  //   partners: 50
  // });
  const [featuredGuides, setFeaturedGuides] = useState([]);
  const [popularTours, setPopularTours] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFeaturedGuides(),
        fetchPopularTours(),
        fetchPlatformStats(),
        fetchRecentBookings(),
      ]);
    } catch (error) {
      console.error("Error fetching platform data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeaturedGuides = async () => {
    try {
      const response = await guidesService.getGuides({
        limit: 6,
        minRating: 3.0,
        available: true,
      });
      setFeaturedGuides(response.guides || []);
    } catch (error) {
      console.error("Failed to fetch featured guides:", error);
      setFeaturedGuides([]);
    }
  };

  const fetchPopularTours = async () => {
    try {
      const response = await toursService.getTours({
        limit: 6,
        sortBy: "popularity",
      });
      setPopularTours(response.tours || []);
    } catch (error) {
      console.error("Failed to fetch popular tours:", error);
      setPopularTours([]);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const stats = await adminService.getDashboardStats();
      setPlatformStats(stats);
    } catch (error) {
      console.error("Failed to fetch platform stats:", error);
      // Set fallback stats
      setPlatformStats({
        totalUsers: 1000,
        totalGuides: 150,
        totalTours: 500,
        totalBookings: 2500,
        averageRating: 4.8,
      });
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await adminService.getAllBookings({ limit: 6 });
      setRecentBookings(response.bookings || []);
    } catch (error) {
      console.error("Failed to fetch recent bookings:", error);
      setRecentBookings([]);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchDestination.trim()) {
      searchParams.set("location", searchDestination.trim());
    }
    if (searchDates) {
      searchParams.set("date", searchDates);
    }
    const queryString = searchParams.toString();
    navigate(`/guides${queryString ? `?${queryString}` : ""}`);
  };

  // Commented out unused variables to fix warnings
  // const handleDestinationClick = (destination) => {
  //   navigate(`/guides?location=${encodeURIComponent(destination)}`);
  // };

  return (
    <div className="homepage">
      {/* Modern Hero Section */}
      <section className="hero-section-modern">
        <div className="hero-particles"></div>
        <div className="hero-background-modern">
          <div className="hero-gradient-overlay"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content-modern">
            <div className="hero-badge">
              <span className="badge-icon">✈️</span>
              <span>Trusted by 10,000+ Travelers</span>
            </div>

            <h1 className="hero-title-modern">
              Discover Vietnam with
              <span className="title-highlight"> Local Experts</span>
            </h1>

            <p className="hero-description">
              Connect with authentic local guides who share their passion for
              Vietnam's hidden gems, rich culture, and unforgettable
              experiences. Your perfect adventure awaits.
            </p>

            <div className="hero-search-modern">
              <div className="search-container-modern">
                <div className="search-input-group">
                  <div className="input-container">
                    <div className="input-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="9"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="input-content">
                      <label>Destination</label>
                      <input
                        type="text"
                        placeholder="Where would you like to explore?"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                  </div>

                  <div className="input-divider"></div>

                  <div className="input-container">
                    <div className="input-icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <line
                          x1="16"
                          y1="2"
                          x2="16"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <line
                          x1="8"
                          y1="2"
                          x2="8"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <line
                          x1="3"
                          y1="10"
                          x2="21"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="input-content">
                      <label>Travel Date</label>
                      <input
                        type="date"
                        value={searchDates}
                        onChange={(e) => setSearchDates(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <button className="search-btn-modern" onClick={handleSearch}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="hero-trust-indicators">
              <div className="trust-item">
                <div className="trust-icon">⭐</div>
                <div className="trust-text">
                  <strong>4.9/5</strong>
                  <span>Average Rating</span>
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">🏆</div>
                <div className="trust-text">
                  <strong>2,500+</strong>
                  <span>Tours Completed</span>
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">🌟</div>
                <div className="trust-text">
                  <strong>150+</strong>
                  <span>Expert Guides</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-container">
              <div className="hero-floating-card">
                <div className="floating-card-content">
                  <div className="guide-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                      alt="Local guide"
                    />
                    <div className="online-indicator"></div>
                  </div>
                  <div className="guide-info">
                    <h4>BaoThanh - Local Guide</h4>
                    <p>Available now in Hanoi</p>
                    <div className="guide-rating">
                      <span>⭐ 4.9</span>
                      <span>•</span>
                      <span>200+ tours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Impact Section */}
      <section className="platform-impact">
        <div className="container">
          <div className="section-header">
            <div className="section-text">
              <h2 className="section-title">
                Connecting Hearts, Creating Memories
              </h2>
              <p className="section-subtitle">
                TourConnect brings together passionate guides and curious
                travelers to create authentic experiences that go beyond
                traditional tourism.
              </p>
            </div>
          </div>

          {platformStats && (
            <div className="impact-stats">
              <StatCard
                icon={<FaUsers />}
                value={`${
                  Math.floor((platformStats.totalUsers || 1000) / 100) * 100
                }+`}
                label="Active Travelers"
                trend="15"
              />
              <StatCard
                icon={<FaUserTie />}
                value={`${platformStats.totalGuides || 150}+`}
                label="Verified Guides"
                trend="8"
              />
              <StatCard
                icon={<FaRoute />}
                value={`${platformStats.totalTours || 500}+`}
                label="Unique Tours"
                trend="12"
              />
              <StatCard
                icon={<FaHandshake />}
                value={`${
                  Math.floor((platformStats.totalBookings || 2500) / 100) * 100
                }+`}
                label="Successful Connections"
                trend="20"
              />
            </div>
          )}
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="featured-guides">
        <div className="container">
          <div className="section-header">
            <div className="section-text">
              <h2 className="section-title">Meet Our Local Experts</h2>
              <p className="section-subtitle">
                Discover passionate guides who are ready to share their local
                knowledge and create personalized experiences just for you.
              </p>
            </div>
            <button
              className="view-all-btn"
              onClick={() => navigate("/guides")}
            >
              Explore All Guides <FaArrowRight />
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <Loading />
            </div>
          ) : (
            <div className="guides-preview-grid">
              {featuredGuides.slice(0, 6).map((guide) => (
                <GuidePreviewCard key={guide.id} guide={guide} />
              ))}
            </div>
          )}

          {!loading && featuredGuides.length === 0 && (
            <div className="no-content">
              <p>Our amazing guides will be featured here soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Tours Section */}
      <section className="popular-tours">
        <div className="container">
          <div className="section-header">
            <div className="section-text">
              <h2 className="section-title">Trending Experiences</h2>
              <p className="section-subtitle">
                Discover the most loved tours and experiences curated by our
                community of travelers and guides.
              </p>
            </div>
            <button className="view-all-btn" onClick={() => navigate("/tours")}>
              Browse All Tours <FaArrowRight />
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <Loading />
            </div>
          ) : (
            <div className="tours-preview-grid">
              {popularTours.slice(0, 6).map((tour) => (
                <TourPreviewCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          {!loading && popularTours.length === 0 && (
            <div className="no-content">
              <p>Amazing tours will be featured here soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Live Activity Section */}
      <section className="live-activity">
        <div className="container">
          <div className="section-header">
            <div className="section-text">
              <h2 className="section-title">Live Connection Activity</h2>
              <p className="section-subtitle">
                See the magic happening in real-time as guides and travelers
                connect around Vietnam.
              </p>
            </div>
            <div className="activity-indicator">
              <div className="pulse-dot"></div>
              <span>Live</span>
            </div>
          </div>

          {!loading && recentBookings.length > 0 && (
            <div className="activity-feed">
              {recentBookings.slice(0, 5).map((booking, index) => (
                <BookingActivityCard key={index} booking={booking} />
              ))}
            </div>
          )}

          {!loading && recentBookings.length === 0 && (
            <div className="no-activity">
              <p>Recent connections will appear here as they happen!</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section - Redesigned */}
      <section className="how-it-works-redesigned">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-title-modern">How TourConnect Works</h2>
            <p className="section-subtitle-modern">
              Connecting travelers with authentic local experiences in just 4
              simple steps
            </p>
          </div>

          <div className="process-timeline">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <div className="step-icon-modern">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="step-title-modern">Discover Guides</h3>
                <p className="step-description-modern">
                  Browse our verified community of local guides. Filter by
                  location, interests, language, and ratings to find your
                  perfect match.
                </p>
              </div>
            </div>

            <div className="timeline-connector"></div>

            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <div className="step-icon-modern">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="step-title-modern">Connect & Chat</h3>
                <p className="step-description-modern">
                  Message guides directly through our platform. Discuss your
                  preferences, ask questions, and customize your ideal
                  experience together.
                </p>
              </div>
            </div>

            <div className="timeline-connector"></div>

            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <div className="step-icon-modern">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="16"
                      y1="2"
                      x2="16"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="2"
                      x2="8"
                      y2="6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="3"
                      y1="10"
                      x2="21"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="step-title-modern">Book Securely</h3>
                <p className="step-description-modern">
                  Reserve your tour with confidence using our secure booking
                  system. Flexible cancellation and payment protection included.
                </p>
              </div>
            </div>

            <div className="timeline-connector"></div>

            <div className="process-step">
              <div className="step-number">04</div>
              <div className="step-content">
                <div className="step-icon-modern">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polygon
                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="step-title-modern">Experience Magic</h3>
                <p className="step-description-modern">
                  Enjoy authentic, personalized adventures. Create lasting
                  memories and meaningful connections that go beyond typical
                  tourism.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <button
              className="cta-button-primary"
              onClick={() => navigate("/guides")}
            >
              Start Your Journey
            </button>
            <button
              className="cta-button-secondary"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-text">
              <h2 className="section-title">Built on Trust & Safety</h2>
              <div className="trust-features">
                <div className="trust-feature">
                  <div className="trust-icon">✅</div>
                  <div>
                    <h4>Verified Guides</h4>
                    <p>
                      Every guide is background-checked and verified by our team
                    </p>
                  </div>
                </div>

                <div className="trust-feature">
                  <div className="trust-icon">⭐</div>
                  <div>
                    <h4>Community Reviews</h4>
                    <p>
                      Real reviews from travelers help you make informed
                      decisions
                    </p>
                  </div>
                </div>

                <div className="trust-feature">
                  <div className="trust-icon">🛡️</div>
                  <div>
                    <h4>Secure Platform</h4>
                    <p>
                      Safe payments, secure messaging, and protected booking
                      system
                    </p>
                  </div>
                </div>

                <div className="trust-feature">
                  <div className="trust-icon">📞</div>
                  <div>
                    <h4>24/7 Support</h4>
                    <p>
                      Our team is here to help before, during, and after your
                      journey
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Adventure?</h2>
            <p className="cta-subtitle">
              Join thousands of travelers who have discovered authentic Vietnam
              through local guides.
            </p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/guides")}
              >
                <FaPlay />
                Find Your Guide
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/become-guide")}
              >
                Become a Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
