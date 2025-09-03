import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [searchParams] = useSearchParams();

  const initialFilters = {
    location: searchParams.get("location") || "",
    category: "",
    priceRange: [20, 200], // Tour price range
    duration: "",
    rating: 0,
    searchQuery: "",
    page: 1,
    limit: 12,
  };

  // State for the filters that are ACTIVELY applied to the search
  const [filters, setFilters] = useState(initialFilters);

  // State to hold the CURRENT form values
  const [formFilters, setFormFilters] = useState(initialFilters);

  const [sortBy, setSortBy] = useState("rating");

  // Debounce the filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  // Load tours when debounced filters change
  useEffect(() => {
    const loadTours = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prepare API filters
        const apiFilters = {
          page: debouncedFilters.page,
          limit: debouncedFilters.limit,
        };

        // Location filter
        if (debouncedFilters.location.trim()) {
          apiFilters.location = debouncedFilters.location.trim();
        }

        // Category filter
        if (debouncedFilters.category) {
          apiFilters.category = debouncedFilters.category;
        }

        // Price range filter
        if (
          debouncedFilters.priceRange[0] > 20 ||
          debouncedFilters.priceRange[1] < 200
        ) {
          apiFilters.minPrice = debouncedFilters.priceRange[0];
          apiFilters.maxPrice = debouncedFilters.priceRange[1];
        }

        // Duration filter
        if (debouncedFilters.duration) {
          apiFilters.duration = debouncedFilters.duration;
        }

        // Rating filter
        if (debouncedFilters.rating > 0) {
          apiFilters.minRating = debouncedFilters.rating;
        }

        // Call the API
        const response = await toursService.getTours(apiFilters);
        let toursData = response.tours || [];

        // Apply search query filter (client-side)
        if (debouncedFilters.searchQuery.trim()) {
          const searchTerm = debouncedFilters.searchQuery.toLowerCase().trim();
          toursData = toursData.filter(
            (tour) =>
              tour.title?.toLowerCase().includes(searchTerm) ||
              tour.description?.toLowerCase().includes(searchTerm) ||
              tour.location?.toLowerCase().includes(searchTerm) ||
              tour.category?.toLowerCase().includes(searchTerm)
          );
        }

        // Apply client-side sorting
        switch (sortBy) {
          case "rating":
            toursData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case "price-low":
            toursData.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
          case "price-high":
            toursData.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
          case "duration":
            toursData.sort(
              (a, b) => (a.duration_hours || 0) - (b.duration_hours || 0)
            );
            break;
          default:
            break;
        }

        setTours(toursData);
        setTotalResults(response.total || toursData.length);
      } catch (err) {
        console.error("❌ Error loading tours:", err);
        setError(err.message || "Failed to load tours");
        setTours([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, [debouncedFilters, sortBy]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFormFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
  };

  const handleDurationToggle = (duration) => {
    setFormFilters((prev) => ({
      ...prev,
      duration: prev.duration === duration ? "" : duration,
    }));
  };

  const handleApplyFilters = () => {
    setFilters(formFilters);
  };

  const clearFilters = () => {
    setFormFilters(initialFilters);
    setFilters(initialFilters);
  };

  // Available options
  const availableCategories = [
    "Adventure",
    "Cultural",
    "Food Tours",
    "Historical",
    "Nature",
    "City Tours",
    "Beach",
    "Hiking",
    "Photography",
    "Nightlife",
  ];

  const availableDurations = [
    "Half Day (2-4 hours)",
    "Full Day (6-8 hours)",
    "Multi-day (2+ days)",
  ];

  const availableLocations = [
    "Hanoi",
    "Ho Chi Minh City",
    "Hoi An",
    "Da Nang",
    "Hue",
    "Nha Trang",
    "Sapa",
    "Ha Long Bay",
  ];

  if (loading) {
    return <LoadingSpinner message="Finding amazing tours for you..." />;
  }

  return (
    <div className="tours-list-page">
      <div className="page-header">
        <h1>Discover Amazing Tours</h1>
        <p>Find the perfect tour experience with local guides</p>
      </div>

      <div className="tours-content">
        <aside className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Search Filter */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Tour name or keyword..."
              value={formFilters.searchQuery}
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
              className="filter-input"
            />
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="City or region..."
              value={formFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="filter-input"
            />
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label>Price Range ($)</label>
            <div className="price-range">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min: ${formFilters.priceRange[0]}</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={formFilters.priceRange[0]}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [
                        parseInt(e.target.value),
                        formFilters.priceRange[1],
                      ])
                    }
                    className="price-slider"
                  />
                </div>
                <div className="price-input-group">
                  <label>Max: ${formFilters.priceRange[1]}</label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={formFilters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange("priceRange", [
                        formFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="price-slider"
                  />
                </div>
              </div>
              <div className="price-display">
                ${formFilters.priceRange[0]} - ${formFilters.priceRange[1]}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label>Categories</label>
            <div className="checkbox-group">
              {availableCategories.map((category) => (
                <label key={category} className="checkbox-item">
                  <input
                    type="radio"
                    name="category"
                    checked={formFilters.category === category}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Filter */}
          <div className="filter-group">
            <label>Duration</label>
            <div className="checkbox-group">
              {availableDurations.map((duration) => (
                <label key={duration} className="checkbox-item">
                  <input
                    type="radio"
                    name="duration"
                    checked={formFilters.duration === duration}
                    onChange={() => handleDurationToggle(duration)}
                  />
                  <span>{duration}</span>
                </label>
              ))}
            </div>
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
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <>
              <div className="results-header">
                <div className="results-info">
                  <span>{totalResults} tours found</span>
                </div>
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
              </div>

              {tours.length === 0 && !loading && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No tours found</h3>
                  <p>
                    Try adjusting your filters or search terms to find more
                    tours.
                  </p>
                  <button className="btn-secondary" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                </div>
              )}

              {tours.length > 0 && (
                <div className="tours-grid">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
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
