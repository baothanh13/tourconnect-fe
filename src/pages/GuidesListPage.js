import React, { useState, useMemo } from 'react';
import { mockGuides, cities, specialties } from '../data/mockData';
import GuideCard from '../components/guide/GuideCard';
import './GuidesListPage.css';

const GuidesListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredAndSortedGuides = useMemo(() => {
    // Safety check for undefined mockGuides
    if (!mockGuides || !Array.isArray(mockGuides)) {
      return [];
    }
    
    let filtered = mockGuides.filter(guide => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));

      // City filter
      const matchesCity = !selectedCity || guide.location === selectedCity;

      // Specialty filter
      const matchesSpecialty = !selectedSpecialty || guide.specialties.includes(selectedSpecialty);

      // Price range filter
      const matchesPrice = guide.pricePerHour >= priceRange[0] && guide.pricePerHour <= priceRange[1];

      // Rating filter
      const matchesRating = guide.rating >= minRating;

      // Availability filter
      const matchesAvailability = !availableOnly || guide.isAvailable;

      return matchesSearch && matchesCity && matchesSpecialty && matchesPrice && matchesRating && matchesAvailability;
    });

    // Sort guides
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.pricePerHour - b.pricePerHour;
        case 'price-high':
          return b.pricePerHour - a.pricePerHour;
        case 'experience':
          return b.experienceYears - a.experienceYears;
        case 'reviews':
          return b.totalReviews - a.totalReviews;
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCity, selectedSpecialty, priceRange, minRating, sortBy, availableOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedSpecialty('');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy('rating');
    setAvailableOnly(false);
  };

  return (
    <div className="guides-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Your Perfect Tour Guide</h1>
          <p>Discover amazing local experiences with verified professional guides</p>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search guides, specialties, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-container">
            <div className="filter-row">
              <div className="filter-group">
                <label>City/Location</label>
                <select 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Cities</option>
                  {cities && cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Specialty</label>
                <select 
                  value={selectedSpecialty} 
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Specialties</option>
                  {specialties && specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Price Range: ${priceRange[0]} - ${priceRange[1]}/hour</label>
                <div className="price-range-container">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="price-range-slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="price-range-slider"
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Minimum Rating</label>
                <select 
                  value={minRating} 
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="filter-select"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              <div className="filter-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                  />
                  Available Now Only
                </label>
              </div>

              <div className="filter-group">
                <button onClick={resetFilters} className="reset-filters-btn">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <div className="results-header">
            <p className="results-count">
              {filteredAndSortedGuides.length} guide{filteredAndSortedGuides.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredAndSortedGuides.length === 0 ? (
            <div className="no-results">
              <h3>No guides found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={resetFilters} className="reset-btn">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="guides-grid">
              {filteredAndSortedGuides.map(guide => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuidesListPage;
