import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { mockGuides } from "../data/mockData";
import GuideCard from "../components/guide/GuideCard";
import Loading from "../components/Loading";
import "./GuidesListPage.css";

const GuidesListPage = () => {
  const location = useLocation();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);

  // Filter options
  const cities = [
    "Paris",
    "London",
    "Tokyo",
    "New York",
    "Rome",
    "Barcelona",
    "Amsterdam",
    "Prague",
    "Vienna",
    "Berlin",
    "Florence",
    "Venice",
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
    "Arabic",
    "Russian",
    "Dutch",
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
        setGuides(mockGuides);
      } catch (error) {
        console.error("Error loading guides:", error);
        setGuides(mockGuides);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  // Handle URL parameters for search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
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

    // Location filter
    if (selectedCity) {
      filtered = filtered.filter((guide) =>
        guide.location.toLowerCase().includes(selectedCity.toLowerCase())
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

    // Date filter (simplified - in real app would check guide's actual availability)
    if (dateFilter) {
      filtered = filtered.filter((guide) => guide.available);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((guide) => guide.rating >= minRating);
    }

    // Availability filter
    if (availableOnly) {
      filtered = filtered.filter((guide) => guide.available);
    }

    // Sort guides by rating (highest first)
    filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  }, [
    guides,
    searchQuery,
    selectedCity,
    selectedLanguage,
    selectedCategory,
    priceRange,
    dateFilter,
    minRating,
    availableOnly,
  ]);

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

              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="filter-select"
              >
                <option value={0}>⭐ Any Rating</option>
                <option value={3}>⭐ 3+ Stars</option>
                <option value={4}>⭐ 4+ Stars</option>
                <option value={4.5}>⭐ 4.5+ Stars</option>
              </select>

              <select
                value={availableOnly ? "available" : "all"}
                onChange={(e) =>
                  setAvailableOnly(e.target.value === "available")
                }
                className="filter-select"
              >
                <option value="all">⚡ Any Availability</option>
                <option value="available">⚡ Available Now</option>
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
          {/* Main Content */}
          <div className="guides-main full-width">
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
                        setSearchQuery("");
                        setSelectedCity("");
                        setSelectedLanguage("");
                        setSelectedCategory("");
                        setPriceRange("all");
                        setDateFilter("");
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
