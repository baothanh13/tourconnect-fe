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
  const [loading, setLoading] = useState(true);
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
  const debouncedFilters = useDebounce(filters, 500);

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
          searchQuery: debouncedFilters.searchQuery,
          location: debouncedFilters.location,
          duration: debouncedFilters.duration,
          rating: debouncedFilters.rating,
          page: debouncedFilters.page,
          limit: 9,
        };

        // Remove empty filters
        Object.keys(apiFilters).forEach((key) => {
          if (
            apiFilters[key] === "" ||
            apiFilters[key] === null ||
            apiFilters[key] === undefined ||
            apiFilters[key] === 0
          ) {
            delete apiFilters[key];
          }
        });

        const response = await toursService.getTours(apiFilters);

        if (response && response.tours) {
          setTours(response.tours || []);

          // Handle pagination from response
          const currentPage = response.currentPage || 1;
          const totalTours = response.totalCount || response.tours.length;
          const limit = apiFilters.limit || 9;
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

  // Handle price range change (for the quick price options)
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
    <div className="tours-list-page">
      <div className="page-header">
        <h1>Discover Amazing Tours</h1>
        <p>Explore unique experiences with local guides and create unforgettable memories</p>
      </div>

      <div className="guides-content">
        <aside className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Search Filter */}
          <div className="filter-group">
            <label>Search Tours</label>
            <input
              type="text"
              placeholder="Tour name or keyword..."
              value={formFilters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label>Location</label>
            <select
              value={formFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="filter-input"
            >
              <option value="">All Locations</option>
              {availableLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label>Category</label>
            <div className="checkbox-group">
              {categories.slice(1).map((category) => ( // Skip "All Categories"
                <label key={category.value} className="checkbox-item">
                  <input
                    type="radio"
                    name="category"
                    checked={formFilters.category === category.value}
                    onChange={() => handleCategoryToggle(category.value)}
                  />
                  <span className="category-icon">{category.icon}</span>
                  <span>{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label>Price Range ($)</label>
            <div className="price-range">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={formFilters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="filter-input price-input-small"
                  min="0"
                />
                <span className="price-separator">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={formFilters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="filter-input price-input-small"
                  min="0"
                />
              </div>
              
              {/* Quick Price Options */}
              <div className="price-pills-small">
                {priceRanges.map((range) => (
                  <button
                    key={range.value}
                    className={`price-pill-small ${
                      getCurrentPriceRange() === range.value ? "active" : ""
                    }`}
                    onClick={() => handlePriceRangeChange(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Duration Filter */}
          <div className="filter-group">
            <label>Duration</label>
            <select
              value={formFilters.duration}
              onChange={(e) => handleFilterChange("duration", e.target.value)}
              className="filter-input"
            >
              {durationOptions.map((duration) => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <label>Minimum Rating</label>
            <div className="rating-filter">
              {[4, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  className={`rating-button ${
                    formFilters.rating === rating ? "active" : ""
                  }`}
                  onClick={() =>
                    handleFilterChange(
                      "rating",
                      formFilters.rating === rating ? 0 : rating
                    )
                  }
                >
                  ⭐ {rating}+
                </button>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="filter-group">
            <button className="apply-filters-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </aside>

        <main className="results-panel">
          {error && (
            <div className="error-message">
              <h3>❌ Error Loading Tours</h3>
              <p>{error}</p>
            </div>
          )}

          {!error && (
            <>
              <div className="results-header">
                <div className="results-info">
                  <span>{pagination.totalTours} tours found</span>
                </div>
              </div>

              <div className="tours-grid">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {tours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}

                    {tours.length === 0 && !loading && (
                      <div className="no-results">
                        <h3>No tours found</h3>
                        <p>Try adjusting your filters or search criteria</p>
                        <button onClick={clearFilters} className="btn-primary">
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className="pagination-btn prev"
                  >
                    ← Previous
                  </button>

                  <div className="pagination-numbers">
                    {(() => {
                      const { currentPage, totalPages } = pagination;
                      const pages = [];
                      const showPages = 5;
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(showPages / 2)
                      );
                      let endPage = Math.min(totalPages, startPage + showPages - 1);

                      if (endPage - startPage + 1 < showPages) {
                        startPage = Math.max(1, endPage - showPages + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }

                      return pages.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`pagination-number ${
                            pageNumber === currentPage ? "active" : ""
                          }`}
                          disabled={loading}
                        >
                          {pageNumber}
                        </button>
                      ));
                    })()}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      loading
                    }
                    className="pagination-btn next"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ToursListPage;
