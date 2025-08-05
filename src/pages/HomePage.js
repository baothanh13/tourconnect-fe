import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { guidesService } from "../services/guidesService";
import { useAuth } from "../contexts/AuthContext";
import TourCategories from "../components/TourCategories";
import "./HomePage.css";

const HomePage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchPriceRange, setSearchPriceRange] = useState("");
  const [featuredGuides, setFeaturedGuides] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadFeaturedGuides();
  }, []);

  const loadFeaturedGuides = async () => {
    try {
      const guides = await guidesService.getGuides({
        featured: true,
        limit: 6,
      });
      setFeaturedGuides(guides.slice(0, 6));
    } catch (error) {
      console.error("Error loading featured guides:", error);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (searchLocation.trim()) {
      searchParams.set("location", searchLocation.trim());
    }
    if (searchDate) {
      searchParams.set("date", searchDate);
    }
    if (searchLanguage) {
      searchParams.set("language", searchLanguage);
    }
    if (searchPriceRange) {
      searchParams.set("priceRange", searchPriceRange);
    }

    const queryString = searchParams.toString();
    navigate(`/guides${queryString ? `?${queryString}` : ""}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const countries = [
    {
      name: "Japan",
      image: "🗼",
      flag: "🇯🇵",
      description: "Ancient traditions meet modern innovation",
      highlights: "Cherry blossoms, temples, and tech cities",
    },
    {
      name: "France",
      image: "🗼",
      flag: "🇫🇷",
      description: "Romance, cuisine, and timeless art",
      highlights: "Eiffel Tower, Louvre, and wine regions",
    },
    {
      name: "Italy",
      image: "🏛️",
      flag: "🇮🇹",
      description: "Renaissance art and culinary excellence",
      highlights: "Rome, Venice, and Tuscan countryside",
    },
    {
      name: "Spain",
      image: "🏰",
      flag: "🇪🇸",
      description: "Vibrant culture and stunning coastlines",
      highlights: "Flamenco, beaches, and architectural marvels",
    },
    {
      name: "Thailand",
      image: "🛕",
      flag: "🇹🇭",
      description: "Tropical paradise with rich heritage",
      highlights: "Temples, beaches, and street food",
    },
    {
      name: "Vietnam",
      image: "🏮",
      flag: "🇻🇳",
      description: "Natural beauty and fascinating history",
      highlights: "Ha Long Bay, ancient towns, and pho",
    },
  ];

  const otherDestinations = [
    {
      name: "London",
      image: "🎡",
      country: "United Kingdom",
      description: "Historic landmarks and modern culture",
      tours: "1,200+ tours available",
    },
    {
      name: "Dubai",
      image: "🌇",
      country: "UAE",
      description: "Luxury shopping and stunning architecture",
      tours: "800+ tours available",
    },
    {
      name: "Sydney",
      image: "🏛️",
      country: "Australia",
      description: "Opera House and harbor views",
      tours: "950+ tours available",
    },
    {
      name: "Singapore",
      image: "🌆",
      country: "Singapore",
      description: "Garden city with diverse attractions",
      tours: "600+ tours available",
    },
    {
      name: "New York",
      image: "🗽",
      country: "USA",
      description: "The city that never sleeps",
      tours: "2,100+ tours available",
    },
    {
      name: "Barcelona",
      image: "🏛️",
      country: "Spain",
      description: "Gaudí architecture and Mediterranean charm",
      tours: "1,400+ tours available",
    },
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
    "Chinese",
    "Korean",
    "Vietnamese",
    "Thai",
    "Arabic",
  ];

  const priceRanges = [
    { value: "budget", label: "Budget ($0-50)" },
    { value: "mid", label: "Mid-range ($50-100)" },
    { value: "luxury", label: "Luxury ($100+)" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-pattern"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Trusted by 10,000+ Travelers</span>
            </div>
            <h1>
              Discover <span className="highlight">Amazing Places</span> with{" "}
              <span className="highlight">Local Guides</span>
            </h1>
            <p className="hero-description">
              Connect with verified local tour guides for personalized,
              authentic experiences. Book unique tours and explore destinations
              like a true local with insider knowledge and passion.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Expert Guides</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Countries</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-search-container">
            <div className="search-card">
              <div className="search-header">
                <h3>Discover Your Perfect Guide</h3>
                <p>Find local experts for unforgettable experiences</p>
              </div>

              <div className="search-form">
                <div className="search-field-group">
                  <div className="search-field">
                    <label htmlFor="destination">
                      <span className="field-icon">📍</span>
                      Destination
                    </label>
                    <input
                      id="destination"
                      type="text"
                      placeholder="Tokyo, Paris, Rome..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="search-input"
                    />
                  </div>

                  <div className="search-field">
                    <label htmlFor="date">
                      <span className="field-icon">📅</span>
                      Travel Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="search-input"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="search-field-group">
                  <div className="search-field">
                    <label htmlFor="language">
                      <span className="field-icon">🗣️</span>
                      Guide Language
                    </label>
                    <select
                      id="language"
                      value={searchLanguage}
                      onChange={(e) => setSearchLanguage(e.target.value)}
                      className="search-select"
                    >
                      <option value="">Any Language</option>
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="search-field">
                    <label htmlFor="price">
                      <span className="field-icon">💰</span>
                      Budget Range
                    </label>
                    <select
                      id="price"
                      value={searchPriceRange}
                      onChange={(e) => setSearchPriceRange(e.target.value)}
                      className="search-select"
                    >
                      <option value="">Any Budget</option>
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="search-button" onClick={handleSearch}>
                  <span className="button-icon">🔍</span>
                  <span>Find Perfect Guides</span>
                </button>
              </div>

              {/* Popular Searches */}
              <div className="popular-searches">
                <span className="popular-label">Popular Destinations:</span>
                <div className="popular-tags">
                  <button onClick={() => setSearchLocation("Tokyo")}>
                    Tokyo
                  </button>
                  <button onClick={() => setSearchLocation("Paris")}>
                    Paris
                  </button>
                  <button onClick={() => setSearchLocation("Rome")}>
                    Rome
                  </button>
                  <button onClick={() => setSearchLocation("Bangkok")}>
                    Bangkok
                  </button>
                  <button onClick={() => setSearchLocation("Barcelona")}>
                    Barcelona
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Access for Logged Users */}
            {user && (
              <div className="user-quick-access">
                <Link
                  to={`/${user.userType}/dashboard`}
                  className="quick-access-btn primary"
                >
                  <span className="btn-icon">📊</span>
                  <span>My Dashboard</span>
                </Link>
                {user.userType === "tourist" && (
                  <Link to="/guides" className="quick-access-btn secondary">
                    <span className="btn-icon">🧭</span>
                    <span>Browse Guides</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tour Categories */}
      <TourCategories />

      {/* Featured Guides */}
      <section className="featured-guides-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Local Guides</h2>
            <Link to="/guides" className="view-all-btn">
              View All Guides →
            </Link>
          </div>

          <div className="guides-grid">
            {featuredGuides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-image">
                  <img src={guide.image} alt={guide.name} />
                  {guide.isVerified && <div className="verified-badge">✅</div>}
                </div>
                <div className="guide-info">
                  <h3>{guide.name}</h3>
                  <p className="guide-location">📍 {guide.location}</p>
                  <div className="guide-rating">
                    ⭐ {guide.rating} ({guide.reviews} reviews)
                  </div>
                  <div className="guide-languages">
                    {guide.languages.slice(0, 2).map((lang) => (
                      <span key={lang} className="language-tag">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="guide-specialties">
                    {guide.specialties.slice(0, 3).join(" • ")}
                  </div>
                  <div className="guide-price">
                    <span className="price-amount">From ${guide.price}</span>
                  </div>
                  <div className="guide-actions">
                    <Link
                      to={`/guides/${guide.id}`}
                      className="btn-view-profile"
                    >
                      View Profile
                    </Link>
                    <Link to={`/booking/${guide.id}`} className="btn-book-now">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose TourConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>100% Private Tours</h3>
              <p>Get Your Very Own Tour Guide</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Quality Assured Guides</h3>
              <p>Screened and Verified Our Guides</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>All Tours Customizable</h3>
              <p>Personalize your experience with flexible itineraries</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Direct Communication</h3>
              <p>Chat directly with guides to plan your perfect tour</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment processing with buyer protection</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Access to guides in over 100+ destinations worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Popular Tour Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>✨ Discover Amazing Destinations</h2>
            <p className="section-subtitle">
              Explore the world's most captivating cities with our expert local
              guides
            </p>
          </div>
          <div className="destinations-grid">
            {otherDestinations.map((destination, index) => (
              <Link
                to={`/guides?location=${destination.name}`}
                key={index}
                className="destination-card"
              >
                <div className="card-header">
                  <div className="destination-image">{destination.image}</div>
                  <div className="destination-badge">{destination.tours}</div>
                </div>
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p className="destination-country">{destination.country}</p>
                  <p className="destination-description">
                    {destination.description}
                  </p>
                </div>
                <div className="card-footer">
                  <span className="explore-btn">Explore Tours →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="countries-section">
        <div className="container">
          <div className="section-header">
            <h2>🌍 Top Travel Destinations by Country</h2>
            <p className="section-subtitle">
              Immerse yourself in diverse cultures and breathtaking landscapes
              around the globe
            </p>
          </div>
          <div className="countries-grid">
            {countries.map((country, index) => (
              <Link
                to={`/guides?country=${country.name}`}
                key={index}
                className="country-card"
              >
                <div className="country-header">
                  <div className="country-image">{country.image}</div>
                  <div className="country-flag">{country.flag}</div>
                </div>
                <div className="country-info">
                  <h3>{country.name}</h3>
                  <p className="country-description">{country.description}</p>
                  <div className="country-highlights">
                    <span className="highlights-label">Must-see:</span>
                    <span className="highlights-text">
                      {country.highlights}
                    </span>
                  </div>
                </div>
                <div className="country-footer">
                  <span className="discover-btn">
                    Discover {country.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/guides" className="view-all-button">
              <span>🌎</span>
              Explore All Countries
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Adventure?</h2>
            <p>
              Join thousands of travelers who have discovered amazing places
              with our local guides
            </p>
            <div className="cta-buttons">
              <Link to="/guides" className="btn-primary">
                Find Your Guide
              </Link>
              {!user && (
                <Link to="/register" className="btn-secondary">
                  Sign Up Free
                </Link>
              )}
              <Link to="/become-guide" className="btn-secondary">
                Become a Guide
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
