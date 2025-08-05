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
    { label: "💰 Any Price", value: "all" },
    { label: "💰 Under $50", value: "0-50" },
    { label: "💰 $50 - $100", value: "50-100" },
    { label: "💰 $100 - $200", value: "100-200" },
    { label: "💰 $200+", value: "200+" },
  ];

  // Load guides data
  useEffect(() => {
    const loadGuides = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const data = await guidesService.getAllGuides();
        setGuides(mockGuides);
      } catch (error) {
        console.error("Error loading guides:", error);
        setGuides(mockGuides); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city");
    const category = params.get("category");
    const search = params.get("search");

    if (city) setSelectedCity(city);
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [location.search]);

  // Filter and sort guides
  const filteredAndSortedGuides = useMemo(() => {
    let filtered = guides;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (guide) =>
          guide.name.toLowerCase().includes(query) ||
          guide.location.toLowerCase().includes(query) ||
          guide.bio.toLowerCase().includes(query) ||
          guide.specialties.some((specialty) =>
            specialty.toLowerCase().includes(query)
          ) ||
          (guide.languages &&
            guide.languages.some((lang) => lang.toLowerCase().includes(query)))
      );
    }

    // Location filters
    if (selectedCity) {
      filtered = filtered.filter((guide) =>
        guide.location.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((guide) =>
        guide.location.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }

    // Specialty filter
    if (selectedSpecialty) {
      filtered = filtered.filter((guide) =>
        guide.specialties.includes(selectedSpecialty)
      );
    }

    // Language filter
    if (selectedLanguage) {
      filtered = filtered.filter(
        (guide) => guide.languages && guide.languages.includes(selectedLanguage)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((guide) =>
        guide.specialties.includes(selectedCategory)
      );
    }

    // Price range filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        filtered = filtered.filter(
          (guide) => guide.price >= min && guide.price <= max
        );
      } else {
        // Handle "200+" case
        filtered = filtered.filter((guide) => guide.price >= min);
      }
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((guide) => guide.rating >= minRating);
    }

    // Availability filter
    if (availableOnly) {
      filtered = filtered.filter((guide) => guide.available);
    }

    // Date filter (simplified - in real app would check guide's actual availability)
    if (dateFilter) {
      // For demo purposes, randomly filter some guides
      filtered = filtered.filter((guide) => guide.available);
    }

    // Sort guides
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "experience":
          return b.experience - a.experience;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [
    guides,
    searchQuery,
    selectedCity,
    selectedCountry,
    selectedSpecialty,
    selectedLanguage,
    selectedCategory,
    priceRange,
    minRating,
    sortBy,
    availableOnly,
    dateFilter,
  ]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedCountry("");
    setSelectedSpecialty("");
    setSelectedLanguage("");
    setSelectedCategory("");
    setPriceRange("all");
    setMinRating(0);
    setSortBy("rating");
    setAvailableOnly(false);
    setDateFilter("");
  };

  // Handle search
  const handleSearch = () => {
    // Search is handled by the filteredAndSortedGuides memo
    // This function can be used for analytics or other side effects
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCity) count++;
    if (selectedCountry) count++;
    if (selectedSpecialty) count++;
    if (selectedLanguage) count++;
    if (selectedCategory) count++;
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
      {/* Search Header */}
      <div className="search-header">
        <div className="container">
          <div className="search-section">
            <div className="main-search">
              <input
                type="text"
                placeholder="Search guides, locations, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍 Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="guides-content">
          {/* Professional Filters Sidebar */}
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Refine Your Search</h3>
              {(minRating > 0 || availableOnly) && (
                <button
                  onClick={() => {
                    setMinRating(0);
                    setAvailableOnly(false);
                  }}
                  className="clear-filters"
                >
                  Clear All
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
                      {rating === 0 ? "Any Rating" : `${rating}+ Stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>⚡ Availability</h4>
              <div className="availability-filter">
                <label className="availability-option">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                  />
                  <span className="availability-label">Available Now</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="guides-main">
            <div className="guides-header">
              <h1>Find Your Perfect Tour Guide</h1>
              <p className="results-count">
                {filteredAndSortedGuides.length} guide
                {filteredAndSortedGuides.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="guides-grid">
              {filteredAndSortedGuides.length > 0 ? (
                filteredAndSortedGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-content">
                    <h3>No guides found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button
                      onClick={() => {
                        setMinRating(0);
                        setAvailableOnly(false);
                      }}
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
