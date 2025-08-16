import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import GuideCard from "../components/GuideCard";
import "./GuidesListPage.css";

// Mock guides data (no changes here)
const mockGuides = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "Ho Chi Minh City",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b372?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.9,
    reviewCount: 124,
    pricePerHour: 25,
    specialties: ["Food Tours", "Cultural Tours"],
    languages: ["English", "Vietnamese"],
    description:
      "Passionate local guide with 5+ years experience showing the hidden gems of Saigon.",
    isVerified: true,
    totalTours: 156,
    yearsExperience: 5,
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    location: "Hanoi",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.8,
    reviewCount: 89,
    pricePerHour: 30,
    specialties: ["Historical Sites", "Architecture"],
    languages: ["English", "Vietnamese", "French"],
    description:
      "History enthusiast ready to share the fascinating stories of Vietnam's capital.",
    isVerified: true,
    totalTours: 98,
    yearsExperience: 4,
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    location: "Hoi An",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.9,
    reviewCount: 167,
    pricePerHour: 35,
    specialties: ["Photography", "Art & Culture"],
    languages: ["English", "Spanish", "Vietnamese"],
    description:
      "Professional photographer and cultural enthusiast who loves capturing Hoi An's magic.",
    isVerified: true,
    totalTours: 203,
    yearsExperience: 6,
  },
  {
    id: 4,
    name: "Duc Nguyen",
    location: "Da Nang",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.7,
    reviewCount: 76,
    pricePerHour: 28,
    specialties: ["Adventure", "Nature"],
    languages: ["English", "Vietnamese"],
    description:
      "Adventure guide specializing in Ba Na Hills and Marble Mountain expeditions.",
    isVerified: true,
    totalTours: 112,
    yearsExperience: 3,
  },
  {
    id: 5,
    name: "Emily Thompson",
    location: "Hue",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.8,
    reviewCount: 134,
    pricePerHour: 32,
    specialties: ["Historical Sites", "Royal Heritage"],
    languages: ["English", "Vietnamese", "German"],
    description:
      "Former historian turned guide, expert in Imperial City and royal tombs.",
    isVerified: true,
    totalTours: 145,
    yearsExperience: 7,
  },
  {
    id: 6,
    name: "Linh Pham",
    location: "Nha Trang",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4.9,
    reviewCount: 92,
    pricePerHour: 26,
    specialties: ["Beach Activities", "Water Sports"],
    languages: ["English", "Vietnamese", "Korean"],
    description:
      "Marine biologist turned guide, perfect for beach and underwater adventures.",
    isVerified: true,
    totalTours: 87,
    yearsExperience: 4,
  },
];

const GuidesListPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const initialFilters = {
    location: searchParams.get("location") || "",
    priceRange: [0, 100],
    languages: [],
    specialties: [],
    rating: 0,
    searchQuery: "",
  };

  // State for the filters that are ACTIVELY applied to the search
  const [filters, setFilters] = useState(initialFilters);

  // --- CHANGE 1: New state to hold the CURRENT form values ---
  const [formFilters, setFormFilters] = useState(initialFilters);

  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    // This useEffect now ONLY runs when the active `filters` or `sortBy` change
    const loadGuides = async () => {
      setLoading(true);
      setTimeout(() => {
        let filteredGuides = [...mockGuides];

        // Filtering logic remains the same
        if (filters.location) {
          filteredGuides = filteredGuides.filter((guide) =>
            guide.location
              .toLowerCase()
              .includes(filters.location.toLowerCase())
          );
        }
        if (filters.searchQuery) {
          filteredGuides = filteredGuides.filter(
            (guide) =>
              guide.name
                .toLowerCase()
                .includes(filters.searchQuery.toLowerCase()) ||
              guide.specialties.some((specialty) =>
                specialty
                  .toLowerCase()
                  .includes(filters.searchQuery.toLowerCase())
              )
          );
        }
        if (filters.languages.length > 0) {
          filteredGuides = filteredGuides.filter((guide) =>
            filters.languages.some((lang) => guide.languages.includes(lang))
          );
        }
        if (filters.specialties.length > 0) {
          filteredGuides = filteredGuides.filter((guide) =>
            filters.specialties.some((specialty) =>
              guide.specialties.includes(specialty)
            )
          );
        }
        if (filters.rating > 0) {
          filteredGuides = filteredGuides.filter(
            (guide) => guide.rating >= filters.rating
          );
        }
        filteredGuides = filteredGuides.filter(
          (guide) =>
            guide.pricePerHour >= filters.priceRange[0] &&
            guide.pricePerHour <= filters.priceRange[1]
        );

        // Sorting logic remains the same
        switch (sortBy) {
          case "rating":
            filteredGuides.sort((a, b) => b.rating - a.rating);
            break;
          case "price-low":
            filteredGuides.sort((a, b) => a.pricePerHour - b.pricePerHour);
            break;
          case "price-high":
            filteredGuides.sort((a, b) => b.pricePerHour - a.pricePerHour);
            break;
          case "reviews":
            filteredGuides.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          default:
            break;
        }

        setGuides(filteredGuides);
        setLoading(false);
      }, 500);
    };

    loadGuides();
  }, [filters, sortBy]);

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
    return <Loading />;
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
              <input
                type="range"
                min="0"
                max="100"
                value={formFilters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [
                    0,
                    parseInt(e.target.value),
                  ])
                }
                className="price-slider"
              />
              <div className="price-display">
                $0 - ${formFilters.priceRange[1]}
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
          <div className="results-header">
            <div className="results-info">
              <span>{guides.length} guides found</span>
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
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>

          {guides.length === 0 && (
            <div className="no-results">
              <h3>No guides found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GuidesListPage;
