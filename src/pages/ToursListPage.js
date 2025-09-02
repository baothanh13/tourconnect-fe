import React, { useState, useEffect } from "react";
import TourCard from "../components/TourCard";
import LoadingSpinner from "../components/LoadingSpinner";
import toursService from "../services/toursService";
import "./ToursListPage.css";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ToursListPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    searchQuery: "",
    location: "",
    duration: "",
    rating: 0,
    page: 1,
    limit: 9,
  });

  // Add form filters for consistent UX like guides page
  const [formFilters, setFormFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    searchQuery: "",
    location: "",
    duration: "",
    rating: 0,
    page: 1,
    limit: 9,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTours: 0,
    limit: 9,
  });

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500); // Reduced delay

  // Categories with icons
  const categories = [
    { value: "", label: "All Categories", icon: "🏷️" },
    { value: "adventure", label: "Adventure", icon: "🏔️" },
    { value: "cultural", label: "Cultural", icon: "🏛️" },
    { value: "food", label: "Food Tours", icon: "🍜" },
    { value: "historical", label: "Historical", icon: "🏺" },
    { value: "nature", label: "Nature", icon: "🌿" },
    { value: "city", label: "City Tours", icon: "🏙️" },
    { value: "beach", label: "Beach", icon: "🏖️" },
    { value: "hiking", label: "Hiking", icon: "🥾" },
    { value: "photography", label: "Photography", icon: "📸" },
    { value: "nightlife", label: "Nightlife", icon: "🌃" },
  ];

  // Price ranges
  const priceRanges = [
    { value: "", label: "Any Price", min: "", max: "" },
    { value: "budget", label: "Under $50", min: "", max: "50" },
    { value: "moderate", label: "$50 - $100", min: "50", max: "100" },
    { value: "premium", label: "$100 - $200", min: "100", max: "200" },
    { value: "luxury", label: "Above $200", min: "200", max: "" },
  ];

  // Load tours when debounced filters change
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError("");

        const apiFilters = {
          category: debouncedFilters.category,
          minPrice: debouncedFilters.minPrice,
          maxPrice: debouncedFilters.maxPrice,
          page: debouncedFilters.page,
          limit: 9,
        };

        // Remove empty filters
        Object.keys(apiFilters).forEach((key) => {
          if (
            apiFilters[key] === "" ||
            apiFilters[key] === null ||
            apiFilters[key] === undefined
          ) {
            delete apiFilters[key];
          }
        });

        const response = await toursService.getTours(apiFilters);

        if (response && response.tours) {
          setTours(response.tours || []);

          // Calculate pagination from API response
          const totalTours = response.total || 0;
          const currentPage = response.page || 1;
          const limit = response.limit || 9;
          const totalPages = Math.ceil(totalTours / limit);

          setPagination({
            currentPage,
            totalPages,
            totalTours,
            limit,
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("❌ Error fetching tours:", err);
        setError(err.message || "Failed to load tours. Please try again.");
        setTours([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalTours: 0,
          limit: 9,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [debouncedFilters]);

  // Duration options
  const durationOptions = [
    { value: "", label: "Any Duration" },
    { value: "1-3", label: "1-3 hours" },
    { value: "4-6", label: "4-6 hours" },
    { value: "7-12", label: "Full Day" },
    { value: "24+", label: "Multi-Day" },
  ];

  // Available locations (you can make this dynamic from API)
  const availableLocations = [
    "Ho Chi Minh City",
    "Hanoi",
    "Da Nang",
    "Hoi An",
    "Nha Trang",
    "Hue",
    "Sa Pa",
    "Ha Long Bay",
  ];

  // Handle form filter changes
  const handleFilterChange = (key, value) => {
    setFormFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle category toggle
  const handleCategoryToggle = (category) => {
    setFormFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
  };

  // Apply filters (like in GuidesListPage)
  const handleApplyFilters = () => {
    setFilters({ ...formFilters, page: 1 });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Handle price range change (for the old pill system)
  const handlePriceRangeChange = (range) => {
    const selectedRange = priceRanges.find((r) => r.value === range);
    const minPrice = selectedRange?.min || "";
    const maxPrice = selectedRange?.max || "";

    setFormFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));
  };

  // Handle category change (for the old pill system)
  const handleCategoryChange = (category) => {
    setFormFilters((prev) => ({ ...prev, category }));
  };

  // Get current price range label
  const getCurrentPriceRange = () => {
    const range = priceRanges.find(
      (r) => r.min === formFilters.minPrice && r.max === formFilters.maxPrice
    );
    return range?.value || "";
  };

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      minPrice: "",
      maxPrice: "",
      searchQuery: "",
      location: "",
      duration: "",
      rating: 0,
      page: 1,
      limit: 9,
    };
    setFormFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  return (
    <div className="modern-tours-page">
      {/* Main Content */}
      <div className="tours-main-content">
        <div className="container">
          {/* Filters Section */}
          <div className="filters-section">
            <div className="filters-header">
              <h2 className="filters-title">Find Your Perfect Adventure</h2>
              <p className="filters-subtitle">
                Use filters below to discover tours that match your interests
              </p>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              <h3 className="filter-section-title">
                <span className="filter-icon">🎯</span>
                Choose Your Interest
              </h3>
              <div className="category-pills">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    className={`category-pill ${
                      filters.category === category.value ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category.value)}
                  >
                    <span className="pill-icon">{category.icon}</span>
                    <span className="pill-text">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Search Filters */}
            <div className="price-search-section">
              <div className="price-filters">
                <h3 className="filter-section-title">
                  <span className="filter-icon">💰</span>
                  Budget Range
                </h3>
                <div className="price-pills">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      className={`price-pill ${
                        getCurrentPriceRange() === range.value ? "active" : ""
                      }`}
                      onClick={() => handlePriceRangeChange(range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {/* Custom Price Inputs */}
                <div className="custom-price-inputs">
                  <div className="price-input-group">
                    <input
                      type="number"
                      placeholder="Min ($)"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: e.target.value,
                          page: 1,
                        }))
                      }
                      className="price-input"
                      min="0"
                    />
                    <span className="input-separator">to</span>
                    <input
                      type="number"
                      placeholder="Max ($)"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxPrice: e.target.value,
                          page: 1,
                        }))
                      }
                      className="price-input"
                      min="0"
                    />
                    <button
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, page: 1 }));
                      }}
                      className="apply-price-btn"
                      disabled={loading}
                    >
                      <span className="btn-icon">🔍</span>
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.category || filters.minPrice || filters.maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="clear-filters-btn"
                  disabled={loading}
                >
                  <span className="btn-icon">✨</span>
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="results-section">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <h3 className="results-count">
                  {loading
                    ? "Searching..."
                    : `${pagination.totalTours} tours found`}
                </h3>
                <p className="results-description">
                  {loading
                    ? "Finding the best tours for you..."
                    : "Handpicked experiences by local experts"}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-state">
                <LoadingSpinner message="Discovering amazing tours..." />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="error-state">
                <div className="error-icon">�</div>
                <h3 className="error-title">Oops! Something went wrong</h3>
                <p className="error-message">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="error-retry-btn"
                >
                  <span className="btn-icon">🔄</span>
                  Try Again
                </button>
              </div>
            )}

            {/* Tours Grid */}
            {!loading && !error && (
              <>
                {tours.length > 0 ? (
                  <div className="tours-grid">
                    {tours.map((tour, index) => (
                      <div
                        key={tour.id}
                        className="tour-card-wrapper"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        <TourCard tour={tour} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results-state">
                    <div className="no-results-icon">🔍</div>
                    <h3 className="no-results-title">No tours found</h3>
                    <p className="no-results-message">
                      Try adjusting your filters or explore our popular
                      categories below
                    </p>
                    <button onClick={clearFilters} className="show-all-btn">
                      <span className="btn-icon">🌟</span>
                      Show All Tours
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination-section">
                    <div className="pagination">
                      <button
                        className={`pagination-btn prev ${
                          pagination.currentPage === 1 ? "disabled" : ""
                        }`}
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1 || loading}
                      >
                        <span className="btn-icon">←</span>
                        Previous
                      </button>

                      <div className="page-numbers">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            let pageNumber;
                            if (pagination.totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (
                              pagination.currentPage >=
                              pagination.totalPages - 2
                            ) {
                              pageNumber = pagination.totalPages - 4 + i;
                            } else {
                              pageNumber = pagination.currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNumber}
                                className={`page-number ${
                                  pagination.currentPage === pageNumber
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={loading}
                              >
                                {pageNumber}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        className={`pagination-btn next ${
                          pagination.currentPage === pagination.totalPages
                            ? "disabled"
                            : ""
                        }`}
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages ||
                          loading
                        }
                      >
                        Next
                        <span className="btn-icon">→</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToursListPage;
