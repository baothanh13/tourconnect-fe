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
  const [loading, setLoading] = useState(false);
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

  const handleQuickDestination = (destination) => {
    setSearchLocation(destination);
    navigate(`/guides?location=${encodeURIComponent(destination)}`);
  };

  const popularDestinations = [
    { name: "Tokyo", image: "🗼", tours: "200+ tours", country: "Japan" },
    { name: "Paris", image: "🗼", tours: "180+ tours", country: "France" },
    { name: "Hoi An", image: "🏮", tours: "150+ tours", country: "Vietnam" },
    { name: "Barcelona", image: "🏛️", tours: "120+ tours", country: "Spain" },
    { name: "New York", image: "🗽", tours: "250+ tours", country: "USA" },
    { name: "Rome", image: "🏛️", tours: "160+ tours", country: "Italy" },
    { name: "Bangkok", image: "🛕", tours: "140+ tours", country: "Thailand" },
    { name: "Istanbul", image: "🕌", tours: "100+ tours", country: "Turkey" },
  ];

  const countries = [
    { name: "Japan", image: "🗼", flag: "🇯🇵" },
    { name: "France", image: "🗼", flag: "🇫🇷" },
    { name: "Italy", image: "🏛️", flag: "🇮🇹" },
    { name: "Spain", image: "🏰", flag: "🇪🇸" },
    { name: "Thailand", image: "🛕", flag: "🇹🇭" },
    { name: "Vietnam", image: "🏮", flag: "🇻🇳" },
  ];

  const otherDestinations = [
    { name: "London", image: "🎡", country: "UK" },
    { name: "Dubai", image: "🌇", country: "UAE" },
    { name: "Sydney", image: "🏛️", country: "Australia" },
    { name: "Singapore", image: "🌆", country: "Singapore" },
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
        <div className="hero-background">
          <div className="hero-content">
            <h1>Discover Amazing Places with Local Guides</h1>
            <p>
              Connect with verified local tour guides for personalized
              experiences
            </p>
            <p>Book unique tours and explore destinations like a local!</p>

            <div className="search-container">
              <div className="advanced-search-box">
                <div className="search-row">
                  <div className="search-field">
                    <label>📍 Destination</label>
                    <input
                      type="text"
                      placeholder="Where do you want to go?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="search-input"
                    />
                  </div>

                  <div className="search-field">
                    <label>📅 Date</label>
                    <input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="search-input"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="search-row">
                  <div className="search-field">
                    <label>🗣️ Language</label>
                    <select
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
                    <label>💰 Price Range</label>
                    <select
                      value={searchPriceRange}
                      onChange={(e) => setSearchPriceRange(e.target.value)}
                      className="search-select"
                    >
                      <option value="">Any Price</option>
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="search-button" onClick={handleSearch}>
                  🔍 Find Tours
                </button>
              </div>
            </div>

            {/* Quick Access for Logged Users */}
            {user && (
              <div className="quick-access">
                <Link to={`/${user.userType}/dashboard`} className="quick-btn">
                  📊 My Dashboard
                </Link>
                {user.userType === "tourist" && (
                  <Link to="/guides" className="quick-btn">
                    🧭 Browse Guides
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
                    {guide.specialties.slice(0, 2).join(", ")}
                  </div>
                  <div className="guide-price">From ${guide.price}/tour</div>
                  <div className="guide-actions">
                    <Link
                      to={`/guides/${guide.id}`}
                      className="btn btn-primary"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/booking/${guide.id}`}
                      className="btn btn-secondary"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="destination-card"
                onClick={() => handleQuickDestination(destination.name)}
              >
                <div className="destination-icon">{destination.image}</div>
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p>{destination.country}</p>
                  <span className="tour-count">{destination.tours}</span>
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
              <div className="feature-icon">🎯</div>
              <h3>All Tours Customizable</h3>
              <p>Personalize your experience with flexible itineraries</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Local Guides</h3>
              <p>All guides are verified and reviewed by our community</p>
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
              <div className="feature-icon">⭐</div>
              <h3>Quality Guarantee</h3>
              <p>Satisfaction guaranteed or your money back</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Access to guides in over 100+ destinations worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Adventure?</h2>
            <p>
              Join thousands of travelers who have discovered amazing places
              with our local guides
            </p>
            <div className="cta-buttons">
              <Link to="/guides" className="btn btn-primary btn-large">
                Find Your Guide
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-secondary btn-large">
                  Sign Up Free
                </Link>
              )}
              <Link to="/become-guide" className="btn btn-outline btn-large">
                Become a Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
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
          </div>
        </div>
      </section>

      {/* Popular Japan Destinations */}
      <section className="destinations-section">
        <div className="container">
          <h2>Popular Japan Tour Destinations</h2>
          <div className="destinations-grid">
            {popularDestinations.map((destination, index) => (
              <Link
                to={`/guides?location=${destination.name}`}
                key={index}
                className="destination-card"
              >
                <div className="destination-image">{destination.image}</div>
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p>{destination.tours}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/guides" className="view-all-button">
              View All Japan Tour Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Other Popular Destinations */}
      <section className="other-destinations-section">
        <div className="container">
          <h2>Other Popular Tour Destinations</h2>
          <div className="destinations-grid">
            {otherDestinations.map((destination, index) => (
              <Link
                to={`/guides?location=${destination.name}`}
                key={index}
                className="destination-card"
              >
                <div className="destination-image">{destination.image}</div>
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p>{destination.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="countries-section">
        <div className="container">
          <h2>Popular Tour Countries</h2>
          <div className="countries-grid">
            {countries.map((country, index) => (
              <Link
                to={`/guides?country=${country.name}`}
                key={index}
                className="country-card"
              >
                <div className="country-image">{country.image}</div>
                <div className="country-info">
                  <h3>
                    {country.name} {country.flag}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="view-all-container">
            <Link to="/guides" className="view-all-button">
              See All Tour Countries
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore with Local Experts?</h2>
            <p>
              Join thousands of travelers who have discovered amazing places
              with our verified tour guides
            </p>
            <div className="cta-buttons">
              <Link to="/guides" className="btn-primary">
                Find Your Guide
              </Link>
              <Link to="/register" className="btn-secondary">
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
