import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDates, setSearchDates] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchDestination.trim()) {
      searchParams.set("location", searchDestination.trim());
    }
    if (searchDates) {
      searchParams.set("date", searchDates);
    }
    const queryString = searchParams.toString();
    navigate(`/guides${queryString ? `?${queryString}` : ""}`);
  };

  const handleDestinationClick = (destination) => {
    navigate(`/guides?location=${encodeURIComponent(destination)}`);
  };

  const featuredDestinations = [
    {
      name: "Hanoi",
      image: "https://images.unsplash.com/photo-1509923936403-148b60b94328?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Explore the historic capital with ancient temples and vibrant street life"
    },
    {
      name: "Ho Chi Minh City",
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Discover the dynamic metropolis blending tradition and modernity"
    },
    {
      name: "Hoi An",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Wander through the enchanting ancient town with lantern-lit streets"
    },
    {
      name: "Hue",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Experience the imperial history and cultural heritage"
    },
    {
      name: "Da Nang",
      image: "https://images.unsplash.com/photo-1559047332-bd2fdc4c543f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Enjoy beautiful beaches and marble mountain adventures"
    },
    {
      name: "Nha Trang",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Relax on pristine beaches and explore underwater wonders"
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1539650116574-75c0c6d73273?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Vietnam landscape" 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Experience Vietnam Like a Local</h1>
            <p className="hero-subtitle">
              Connect with authentic, top-rated guides for an unforgettable adventure
            </p>
          </div>
          
          <div className="hero-search">
            <div className="search-form">
              <div className="search-field">
                <label htmlFor="destination">Destination</label>
                <input
                  id="destination"
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchDestination}
                  onChange={(e) => setSearchDestination(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="search-field">
                <label htmlFor="dates">Dates</label>
                <input
                  id="dates"
                  type="date"
                  placeholder="When?"
                  value={searchDates}
                  onChange={(e) => setSearchDates(e.target.value)}
                />
              </div>
              
              <button className="search-button" onClick={handleSearch}>
                <span>🔍</span>
                Find Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">🔍</div>
              <h3 className="step-title">1. Find Your Guide</h3>
              <p className="step-description">
                Browse our curated selection of local guides and find the perfect match for your interests
              </p>
            </div>
            
            <div className="step">
              <div className="step-icon">📅</div>
              <h3 className="step-title">2. Book Your Tour</h3>
              <p className="step-description">
                Choose your preferred date, time, and customize your experience with your selected guide
              </p>
            </div>
            
            <div className="step">
              <div className="step-icon">🎯</div>
              <h3 className="step-title">3. Start Your Adventure</h3>
              <p className="step-description">
                Meet your guide and embark on an authentic, personalized journey through Vietnam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="featured-destinations">
        <div className="container">
          <h2 className="section-title">Featured Destinations</h2>
          <p className="section-subtitle">
            Discover the most popular destinations in Vietnam with local experts
          </p>
          
          <div className="destinations-grid">
            {featuredDestinations.map((destination, index) => (
              <div 
                key={index} 
                className="destination-card"
                onClick={() => handleDestinationClick(destination.name)}
              >
                <div className="destination-image">
                  <img src={destination.image} alt={destination.name} />
                  <div className="destination-overlay">
                    <button className="explore-button">Explore Guides</button>
                  </div>
                </div>
                <div className="destination-content">
                  <h3 className="destination-name">{destination.name}</h3>
                  <p className="destination-description">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-content">
            <div className="trust-text">
              <h2 className="section-title">Travel with Confidence</h2>
              <div className="trust-features">
                <div className="trust-feature">
                  <div className="trust-icon">✅</div>
                  <div>
                    <h4>Verified Guides</h4>
                    <p>All our guides are background-checked and verified</p>
                  </div>
                </div>
                
                <div className="trust-feature">
                  <div className="trust-icon">⭐</div>
                  <div>
                    <h4>Real Reviews</h4>
                    <p>Read authentic reviews from fellow travelers</p>
                  </div>
                </div>
                
                <div className="trust-feature">
                  <div className="trust-icon">🛡️</div>
                  <div>
                    <h4>Secure Booking</h4>
                    <p>Safe and secure payment processing</p>
                  </div>
                </div>
                
                <div className="trust-feature">
                  <div className="trust-icon">📞</div>
                  <div>
                    <h4>24/7 Support</h4>
                    <p>We're here to help before, during, and after your trip</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="trust-stats">
              <div className="stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Verified Guides</div>
              </div>
              <div className="stat">
                <div className="stat-number">50k+</div>
                <div className="stat-label">Happy Travelers</div>
              </div>
              <div className="stat">
                <div className="stat-number">4.9</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
