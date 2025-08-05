import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { guidesService } from "../services/guidesService";
import { mockGuides, cities, specialties } from "../data/mockData";
import GuideCard from "../components/guide/GuideCard";
import Loading from "../components/Loading";
import "./GuidesListPage.css";

const GuidesListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  // Available options for filters
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
  const categories = [
    "Cultural Tours",
    "Food Tours",
    "Adventure Tours",
    "City Tours",
    "Nature Tours",
    "Photography Tours",
    "Historical Tours",
    "Art & Culture",
  ];
  const priceRanges = [
    { value: "all", label: "Any Price" },
    { value: "budget", label: "Budget ($0-50)" },
    { value: "mid", label: "Mid-range ($50-100)" },
    { value: "luxury", label: "Luxury ($100+)" },
  ];

  // Load guides on component mount and when filters change
  useEffect(() => {
    loadGuides();
  }, []);

  // Handle URL parameters for filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const locationParam = urlParams.get("location");
    const countryParam = urlParams.get("country");
    const categoryParam = urlParams.get("category");
    const languageParam = urlParams.get("language");
    const priceRangeParam = urlParams.get("priceRange");
    const dateParam = urlParams.get("date");
    const searchParam = urlParams.get("search");

    if (locationParam) {
      setSelectedCity(locationParam);
    }
    if (countryParam) {
      setSelectedCountry(countryParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (languageParam) {
      setSelectedLanguage(languageParam);
    }
    if (priceRangeParam) {
      setPriceRange(priceRangeParam);
    }
    if (dateParam) {
      setDateFilter(dateParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  const loadGuides = async () => {
    try {
      setLoading(true);
      const guidesData = await guidesService.getGuides();
      setGuides(guidesData);
    } catch (error) {
      console.error("Error loading guides:", error);
      // Fallback to mock data
      setGuides(mockGuides || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const searchResults = await guidesService.searchGuides({
          query: searchQuery,
          location: selectedCity,
          language: selectedLanguage,
          priceRange: priceRange !== "all" ? priceRange : undefined,
          category: selectedCategory,
        });
        setGuides(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      loadGuides();
    }
  };

  const filteredAndSortedGuides = useMemo(() => {
    if (!guides || !Array.isArray(guides)) {
      return [];
    }

    let filtered = guides.filter((guide) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.specialties.some((spec) =>
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // City/Location filter
      const matchesCity =
        !selectedCity ||
        guide.location === selectedCity ||
        guide.city === selectedCity ||
        guide.location.toLowerCase().includes(selectedCity.toLowerCase()) ||
        (guide.city &&
          guide.city.toLowerCase().includes(selectedCity.toLowerCase()));

      // Country filter
      const matchesCountry =
        !selectedCountry ||
        guide.country === selectedCountry ||
        (guide.country &&
          guide.country.toLowerCase().includes(selectedCountry.toLowerCase()));

      // Specialty/Category filter
      const matchesSpecialty =
        !selectedSpecialty || guide.specialties.includes(selectedSpecialty);

      const matchesCategory =
        !selectedCategory || guide.specialties.includes(selectedCategory);

      // Language filter
      const matchesLanguage =
        !selectedLanguage ||
        (guide.languages && guide.languages.includes(selectedLanguage));

      // Price range filter
      const matchesPrice = (() => {
        if (priceRange === "all") return true;
        const price = guide.price || guide.pricePerHour || 0;
        switch (priceRange) {
          case "budget":
            return price <= 50;
          case "mid":
            return price > 50 && price <= 100;
          case "luxury":
            return price > 100;
          default:
            return true;
        }
      })();

      // Rating filter
      const matchesRating = guide.rating >= minRating;

      // Availability filter
      const matchesAvailability =
        !availableOnly ||
        guide.availability === "Available today" ||
        guide.isAvailable;

      // Date filter (simplified - in real app would check guide's calendar)
      const matchesDate = !dateFilter || true; // Simplified for now

      return (
        matchesSearch &&
        matchesCity &&
        matchesCountry &&
        matchesSpecialty &&
        matchesCategory &&
        matchesLanguage &&
        matchesPrice &&
        matchesRating &&
        matchesAvailability &&
        matchesDate
      );
    });

    // Sort guides
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return (
            (a.price || a.pricePerHour || 0) - (b.price || b.pricePerHour || 0)
          );
        case "price-high":
          return (
            (b.price || b.pricePerHour || 0) - (a.price || a.pricePerHour || 0)
          );
        case "reviews":
          return b.reviews - a.reviews;
        case "newest":
          return (
            new Date(b.joinedDate || b.createdAt || 0) -
            new Date(a.joinedDate || a.createdAt || 0)
          );
        default:
          return b.rating - a.rating;
      }
    });
  }, [
    guides,
    searchQuery,
    selectedCity,
    selectedCountry,
    selectedSpecialty,
    selectedCategory,
    selectedLanguage,
    priceRange,
    minRating,
    sortBy,
    availableOnly,
    dateFilter,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedCountry("");
    setSelectedSpecialty("");
    setSelectedCategory("");
    setSelectedLanguage("");
    setPriceRange("all");
    setMinRating(0);
    setSortBy("rating");
    setAvailableOnly(false);
    setDateFilter("");
    navigate("/guides", { replace: true });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCity) count++;
    if (selectedCountry) count++;
    if (selectedSpecialty) count++;
    if (selectedCategory) count++;
    if (selectedLanguage) count++;
    if (priceRange !== "all") count++;
    if (minRating > 0) count++;
    if (availableOnly) count++;
    if (dateFilter) count++;
    return count;
  };

  if (loading) {
    return <Loading size="large" text="Loading amazing guides..." overlay />;
  }

  return (
    <div className="guides-list-page">
      {/* Search and Filters Header */}
      <div className="search-header">
        <div className="container">
          <div className="search-section">
            <div className="main-search">
              <input
                type="text"
                placeholder="Search guides, locations, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="search-input"
              />
              <button onClick={handleSearch} className="search-btn">
                🔍 Search
              </button>
            </div>

            <div className="quick-filters">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="filter-select"
              >
                <option value="">📍 Any Location</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="filter-select"
              >
                <option value="">🗣️ Any Language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">🎯 Any Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="filter-select"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="guides-content">
          {/* Professional Filters */}
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Refine Your Search</h3>
              {getActiveFiltersCount() > 0 && (
                <button onClick={clearAllFilters} className="clear-filters">
                  Clear All ({getActiveFiltersCount()})
                </button>
              )}
            </div>

            <div className="filter-group">
              <h4>⭐ Minimum Rating</h4>
              <div className="rating-filter">
                {[0, 3, 4, 4.5].map((rating) => (
                  <label key={rating} className="rating-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={minRating === rating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                    />
                    <span className="rating-label">
                      {rating === 0 ? "Any Rating" : `${rating}+ ⭐`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>⚡ Availability</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Available Today Only</span>
              </label>
            </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            <div className="results-header">
              <div className="results-info">
                <h2>
                  {filteredAndSortedGuides.length} Guide
                  {filteredAndSortedGuides.length !== 1 ? "s" : ""} Found
                </h2>
                {(selectedCity || selectedCountry) && (
                  <p>in {selectedCity || selectedCountry}</p>
                )}
              </div>

              <div className="sort-controls">
                <label>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💰 Price: High to Low</option>
                  <option value="reviews">📝 Most Reviews</option>
                  <option value="newest">🆕 Newest Guides</option>
                </select>
              </div>
            </div>

            {/* Guides Grid */}
            <div className="guides-grid">
              {filteredAndSortedGuides.length > 0 ? (
                filteredAndSortedGuides.map((guide) => (
                  <div key={guide.id} className="guide-card-wrapper">
                    <div className="guide-card">
                      <div className="guide-image">
                        <img src={guide.image} alt={guide.name} />
                        {guide.isVerified && (
                          <div className="verified-badge">✅ Verified</div>
                        )}
                        {guide.availability === "Available today" && (
                          <div className="available-badge">
                            ⚡ Available Today
                          </div>
                        )}
                      </div>

                      <div className="guide-info">
                        <div className="guide-header">
                          <h3>{guide.name}</h3>
                          <div className="guide-rating">
                            ⭐ {guide.rating} ({guide.reviews} reviews)
                          </div>
                        </div>

                        <p className="guide-location">📍 {guide.location}</p>

                        <div className="guide-languages">
                          <span className="label">Languages:</span>
                          {guide.languages.slice(0, 3).map((lang) => (
                            <span key={lang} className="language-tag">
                              {lang}
                            </span>
                          ))}
                        </div>

                        <div className="guide-specialties">
                          <span className="label">Specialties:</span>
                          <p>{guide.specialties.slice(0, 2).join(", ")}</p>
                        </div>

                        <div className="guide-description">
                          <p>
                            {guide.description?.substring(0, 100) ||
                              "Expert local guide ready to show you amazing experiences."}
                            ...
                          </p>
                        </div>

                        <div className="guide-footer">
                          <div className="guide-price">
                            From <strong>${guide.price}/tour</strong>
                          </div>
                          <div className="guide-response">
                            {guide.responseTime}
                          </div>
                        </div>

                        <div className="guide-actions">
                          <button
                            onClick={() => navigate(`/guides/${guide.id}`)}
                            className="btn btn-primary"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => navigate(`/booking/${guide.id}`)}
                            className="btn btn-secondary"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-content">
                    <h3>No guides found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearAllFilters}
                      className="btn btn-primary"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesListPage;
