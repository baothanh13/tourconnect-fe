import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import GuideCard from "../components/GuideCard";
import guidesService from "../services/guidesService";
import "./GuidesListPage.css";

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

const GuidesListPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [searchParams] = useSearchParams();

  const initialFilters = {
    location: searchParams.get("location") || "",
    priceRange: [10, 100], // Set realistic default range
    languages: [],
    specialties: [],
    rating: 0,
    searchQuery: "",
    page: 1,
    limit: 20,
  };

  // State for the filters that are ACTIVELY applied to the search
  const [filters, setFilters] = useState(initialFilters);

  // --- New state to hold the CURRENT form values ---
  const [formFilters, setFormFilters] = useState(initialFilters);

  const [sortBy, setSortBy] = useState("rating");

  // Debounce the filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    // This useEffect now calls the real API when debouncedFilters or sortBy change
    const loadGuides = async () => {
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

        // Languages filter
        if (debouncedFilters.languages.length > 0) {
          apiFilters.language = JSON.stringify(debouncedFilters.languages);
        }

        // Specialties filter (categories)
        if (debouncedFilters.specialties.length > 0) {
          apiFilters.category = JSON.stringify(debouncedFilters.specialties);
        }

        // Rating filter
        if (debouncedFilters.rating > 0) {
          apiFilters.minRating = debouncedFilters.rating;
        }

        // Price range filter - always send if user has modified it
        if (
          debouncedFilters.priceRange[0] > 0 ||
          debouncedFilters.priceRange[1] < 100
        ) {
          apiFilters.priceRange = `${debouncedFilters.priceRange[0]}-${debouncedFilters.priceRange[1]}`;
        }

        // Only available guides
        apiFilters.available = "true";

        // Call the real API
        const response = await guidesService.getGuides(apiFilters);

        let guidesData = response.guides || [];

        // Apply search query filter (since API doesn't have full text search yet)
        if (debouncedFilters.searchQuery.trim()) {
          const searchTerm = debouncedFilters.searchQuery.toLowerCase().trim();
          guidesData = guidesData.filter(
            (guide) =>
              guide.user_name?.toLowerCase().includes(searchTerm) ||
              guide.description?.toLowerCase().includes(searchTerm) ||
              (guide.specialties || []).some((specialty) =>
                specialty.toLowerCase().includes(searchTerm)
              ) ||
              (guide.languages || []).some((lang) =>
                lang.toLowerCase().includes(searchTerm)
              )
          );
        }

        // Apply client-side sorting (since API doesn't support all sort options)
        switch (sortBy) {
          case "rating":
            guidesData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case "price-low":
            guidesData.sort(
              (a, b) => (a.price_per_hour || 0) - (b.price_per_hour || 0)
            );
            break;
          case "price-high":
            guidesData.sort(
              (a, b) => (b.price_per_hour || 0) - (a.price_per_hour || 0)
            );
            break;
          case "reviews":
            guidesData.sort(
              (a, b) => (b.total_reviews || 0) - (a.total_reviews || 0)
            );
            break;
          default:
            break;
        }

        setGuides(guidesData);
        setTotalResults(response.total || guidesData.length);
      } catch (err) {
        console.error("❌ Error loading guides:", err);
        setError(err.message || "Failed to load guides");
        setGuides([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, [debouncedFilters, sortBy]);

  // --- CHANGE 2: All input handlers now update the temporary `formFilters` state ---
  const handleFilterChange = (filterType, value) => {
    setFormFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleLanguageToggle = (language) => {
    setFormFilters((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((lang) => lang !== language)
        : [...prev.languages, language],
    }));
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormFilters((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((spec) => spec !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  // --- CHANGE 3: Create a new function to apply the form filters to the search ---
  const handleApplyFilters = () => {
    setFilters(formFilters);
  };

  const clearFilters = () => {
    setFormFilters(initialFilters);
    setFilters(initialFilters); // Also reset the active filters
  };

  const availableLanguages = [
    "English",
    "Vietnamese",
    "French",
    "Spanish",
    "German",
    "Korean",
    "Japanese",
  ];
  const availableSpecialties = [
    "Food Tours",
    "Cultural Tours",
    "Historical Sites",
    "Architecture",
    "Photography",
    "Art & Culture",
    "Adventure",
    "Nature",
    "Beach Activities",
    "Water Sports",
    "Royal Heritage",
  ];

  if (loading) {
    return <LoadingSpinner message="Finding amazing guides for you..." />;
  }

  return (
    <div className="guides-list-page">
      <div className="page-header">
        <h1>Find Your Perfect Guide</h1>
        <p>Discover local experts ready to show you the authentic Vietnam</p>
      </div>

      <div className="guides-content">
        <aside className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* All inputs now use `formFilters` for their value */}
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Guide name or specialty..."
              value={formFilters.searchQuery}
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
              className="filter-input"
            />
          </div>

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

          <div className="filter-group">
            <label>Price Range ($/hour)</label>
            <div className="price-range">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min: ${formFilters.priceRange[0]}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
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
                    max="200"
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

          <div className="filter-group">
            <label>Languages</label>
            <div className="checkbox-group">
              {availableLanguages.map((language) => (
                <label key={language} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formFilters.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                  />
                  <span>{language}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Specialties</label>
            <div className="checkbox-group">
              {availableSpecialties.map((specialty) => (
                <label key={specialty} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formFilters.specialties.includes(specialty)}
                    onChange={() => handleSpecialtyToggle(specialty)}
                  />
                  <span>{specialty}</span>
                </label>
              ))}
            </div>
          </div>

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

          {/* --- CHANGE 4: Add the "Apply Filters" button --- */}
          <div className="filter-group">
            <button className="apply-filters-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </aside>

        <main className="results-panel">
          {error && (
            <div className="error-message">
              <h3>❌ Error Loading Guides</h3>
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
                  <span>{totalResults} guides found</span>
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
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              </div>

              <div className="guides-grid">
                {guides.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={{
                      // API field mapping - keep original field names
                      id: guide.id,
                      user_name: guide.user_name,
                      user_email: guide.user_email,
                      phone: guide.phone,
                      location: guide.location,
                      current_location: guide.current_location,
                      avatar_url:
                        guide.avatar_url ||
                        "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
                      rating: guide.rating,
                      total_reviews: guide.total_reviews,
                      price_per_hour: guide.price_per_hour,
                      experience_years: guide.experience_years,
                      description: guide.description,
                      languages: guide.languages || [],
                      specialties: guide.specialties || [],
                      certificates: guide.certificates || [],
                      is_available: guide.is_available,
                      verification_status: guide.verification_status,
                    }}
                  />
                ))}
              </div>

              {guides.length === 0 && !loading && (
                <div className="no-results">
                  <h3>No guides found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
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

export default GuidesListPage;
