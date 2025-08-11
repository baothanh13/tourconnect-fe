import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import "./GuidesListPage.css";

const GuidesListPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    priceRange: "",
    rating: "",
  });

  useEffect(() => {
    loadGuides();
  }, [filters]);

  const loadGuides = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockGuides = [
        {
          id: 1,
          name: "Sarah Chen",
          location: "Ho Chi Minh City",
          avatar: "/api/placeholder/150/150",
          rating: 4.8,
          reviewCount: 124,
          pricePerHour: 25,
          specialties: ["Cultural Tours", "Food Tours"],
          languages: ["English", "Vietnamese"],
          description:
            "Passionate local guide with 5+ years experience showing the hidden gems of Saigon.",
          isVerified: true,
        },
        {
          id: 2,
          name: "Ahmed Hassan",
          location: "Hanoi",
          avatar: "/api/placeholder/150/150",
          rating: 4.9,
          reviewCount: 89,
          pricePerHour: 30,
          specialties: ["Historical Sites", "Architecture"],
          languages: ["English", "Vietnamese", "French"],
          description:
            "History enthusiast ready to share the fascinating stories of Vietnam's capital.",
          isVerified: true,
        },
        {
          id: 3,
          name: "Maria Santos",
          location: "Da Nang",
          avatar: "/api/placeholder/150/150",
          rating: 4.7,
          reviewCount: 156,
          pricePerHour: 22,
          specialties: ["Beach Tours", "Adventure Tours"],
          languages: ["English", "Vietnamese", "Spanish"],
          description:
            "Adventure guide specializing in coastal experiences and outdoor activities.",
          isVerified: true,
        },
      ];
      setGuides(mockGuides);
    } catch (error) {
      console.error("Error loading guides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (loading) {
    return <Loading overlay text="Loading guides..." />;
  }

  return (
    <div className="guides-list-page">
      <div className="page-header">
        <div className="container">
          <h1>Find Your Perfect Guide</h1>
          <p>Discover amazing local experiences with verified tour guides</p>
        </div>
      </div>

      <div className="container">
        <div className="guides-content">
          {/* Filters Section */}
          <div className="filters-section">
            <h3>Filter Guides</h3>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="ho-chi-minh-city">Ho Chi Minh City</option>
                <option value="hanoi">Hanoi</option>
                <option value="da-nang">Da Nang</option>
                <option value="hoi-an">Hoi An</option>
                <option value="nha-trang">Nha Trang</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="cultural">Cultural Tours</option>
                <option value="food">Food Tours</option>
                <option value="historical">Historical Sites</option>
                <option value="adventure">Adventure Tours</option>
                <option value="beach">Beach Tours</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
              >
                <option value="">Any Price</option>
                <option value="0-20">$0 - $20</option>
                <option value="20-30">$20 - $30</option>
                <option value="30-50">$30 - $50</option>
                <option value="50+">$50+</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>

          {/* Guides Grid */}
          <div className="guides-grid">
            {guides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-avatar">
                  <img src={guide.avatar} alt={guide.name} />
                  {guide.isVerified && <div className="verified-badge">✓</div>}
                </div>

                <div className="guide-info">
                  <h3>{guide.name}</h3>
                  <p className="location">📍 {guide.location}</p>

                  <div className="rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-text">
                      {guide.rating} ({guide.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="specialties">
                    {guide.specialties.map((specialty) => (
                      <span key={specialty} className="specialty-tag">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <p className="description">{guide.description}</p>

                  <div className="languages">
                    <strong>Languages:</strong> {guide.languages.join(", ")}
                  </div>

                  <div className="guide-footer">
                    <div className="price">
                      <span className="amount">${guide.pricePerHour}</span>
                      <span className="period">/hour</span>
                    </div>

                    <Link
                      to={`/guides/${guide.id}`}
                      className="view-profile-btn"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesListPage;
