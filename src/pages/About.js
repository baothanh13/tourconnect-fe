import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About TourConnect</h1>
          <p>Connecting travelers with passionate local guides worldwide</p>
        </section>

        {/* Our Story */}
        <section className="our-story">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2025, TourConnect was born from a simple belief: that
                the best way to experience a destination is through the eyes of
                someone who truly knows and loves it. We started as a small team
                of travel enthusiasts who wanted to create authentic,
                personalized experiences for every traveler.
              </p>
              <p>
                Today, we're proud to connect thousands of travelers with
                verified local guides across Vietnam and around the world,
                creating unforgettable memories one tour at a time.
              </p>
            </div>
            <div className="story-image">
              <img
                src="/assets/story.jpg"
                alt="Our Story"
                className="story-img"
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <h2>Our Mission</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Authentic Experiences</h3>
              <p>
                We connect you with local guides who share genuine passion for
                their destinations, ensuring authentic and meaningful travel
                experiences.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🤝</div>
              <h3>Trust & Safety</h3>
              <p>
                All our guides are carefully verified and reviewed. We
                prioritize your safety and satisfaction with comprehensive
                insurance coverage.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🌟</div>
              <h3>Personalization</h3>
              <p>
                Every tour is customizable to match your interests, pace, and
                preferences. Your journey, your way.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <h2>TourConnect by the Numbers</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Verified Guides</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-list">
            <div className="value-item">
              <h3>🌍 Sustainability</h3>
              <p>
                We promote responsible tourism that benefits local communities
                and preserves cultural heritage.
              </p>
            </div>
            <div className="value-item">
              <h3>💡 Innovation</h3>
              <p>
                We continuously improve our platform with cutting-edge
                technology to enhance your booking experience.
              </p>
            </div>
            <div className="value-item">
              <h3>❤️ Community</h3>
              <p>
                We build lasting relationships between travelers and guides,
                creating a global community of cultural exchange.
              </p>
            </div>
            <div className="value-item">
              <h3>🔒 Integrity</h3>
              <p>
                We operate with transparency, honesty, and fairness in all our
                interactions with travelers and guides.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img
                src="/assets/member1.jpg"
                alt="Nguyen Van A"
                className="member-avatar"
              />
              <h3>Nguyen Van A</h3>
              <p>Founder & CEO</p>
              <p>Passionate traveler with 10+ years in tourism industry</p>
            </div>
            <div className="team-member">
              <img
                src="/assets/member2.jpg"
                alt="Tran Thi B"
                className="member-avatar"
              />
              <h3>Tran Thi B</h3>
              <p>CTO</p>
              <p>
                Technology expert focused on creating seamless user experiences
              </p>
            </div>
            <div className="team-member">
              <img
                src="/assets/member3.jpg"
                alt="Le Van C"
                className="member-avatar"
              />
              <h3>Le Van C</h3>
              <p>Head of Operations</p>
              <p>Ensures quality and safety standards across all tours</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <h2>Join Our Community</h2>
          <p>
            Whether you're a traveler seeking authentic experiences or a local
            guide ready to share your passion, we'd love to have you.
          </p>
          <div className="cta-buttons">
            <a href="/guides" className="btn-primary">
              Find Your Guide
            </a>
            <a href="/become-guide" className="btn-secondary">
              Become a Guide
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
