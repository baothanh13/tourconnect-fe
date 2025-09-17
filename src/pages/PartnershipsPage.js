import React from "react";
import { Link } from "react-router-dom";
import "./PartnershipsPage.css";

const PartnershipsPage = () => {
  return (
    <div className="partnerships-page">
      <div className="page-header">
        <div className="container">
          <h1>Partnership Opportunities</h1>
          <p>
            Join forces with TourConnect to create extraordinary travel
            experiences and grow together
          </p>
        </div>
      </div>

      <div className="container">
        <div className="partnerships-content">
          <section className="intro-section">
            <h2>🤝 Partner with TourConnect</h2>
            <p>
              We believe in the power of collaboration. Whether you're a travel
              company, technology provider, educational institution, or cultural
              organization, we're always looking for partnerships that enhance
              the travel experience and create mutual value.
            </p>
          </section>

          <section className="partnership-types">
            <h2>🔗 Types of Partnerships</h2>

            <div className="partnership-grid">
              <div className="partnership-card">
                <div className="partnership-icon">🏢</div>
                <h3>Travel Agencies</h3>
                <p>
                  Integrate our local guide network into your travel packages.
                  Offer your clients authentic local experiences that set your
                  packages apart from the competition.
                </p>
                <ul>
                  <li>White-label solutions</li>
                  <li>API integration</li>
                  <li>Custom pricing tiers</li>
                  <li>Dedicated account management</li>
                </ul>
              </div>

              <div className="partnership-card">
                <div className="partnership-icon">🏨</div>
                <h3>Hotels & Resorts</h3>
                <p>
                  Enhance your guest experience by offering curated local tours
                  and activities. Generate additional revenue while providing
                  value-added services.
                </p>
                <ul>
                  <li>Concierge integration</li>
                  <li>Guest experience packages</li>
                  <li>Revenue sharing models</li>
                  <li>Branded booking platforms</li>
                </ul>
              </div>

              <div className="partnership-card">
                <div className="partnership-icon">💻</div>
                <h3>Technology Partners</h3>
                <p>
                  Collaborate on innovative solutions that improve the travel
                  experience. From booking platforms to mobile apps and travel
                  tech solutions.
                </p>
                <ul>
                  <li>API partnerships</li>
                  <li>Platform integrations</li>
                  <li>Co-development projects</li>
                  <li>Technology licensing</li>
                </ul>
              </div>

              <div className="partnership-card">
                <div className="partnership-icon">🎓</div>
                <h3>Educational Institutions</h3>
                <p>
                  Create immersive learning experiences for students. Partner
                  with us for educational tours, cultural exchanges, and study
                  abroad programs.
                </p>
                <ul>
                  <li>Student group discounts</li>
                  <li>Educational tour packages</li>
                  <li>Cultural immersion programs</li>
                  <li>Academic partnerships</li>
                </ul>
              </div>

              <div className="partnership-card">
                <div className="partnership-icon">🌍</div>
                <h3>Tourism Boards</h3>
                <p>
                  Promote your destination through authentic local experiences.
                  Work with us to showcase the best your region has to offer to
                  international visitors.
                </p>
                <ul>
                  <li>Destination marketing</li>
                  <li>Guide certification programs</li>
                  <li>Promotional campaigns</li>
                  <li>Visitor experience enhancement</li>
                </ul>
              </div>

              <div className="partnership-card">
                <div className="partnership-icon">💳</div>
                <h3>Financial Services</h3>
                <p>
                  Provide travel-related financial services to our community.
                  From payment processing to travel insurance and loyalty
                  programs.
                </p>
                <ul>
                  <li>Payment gateway integration</li>
                  <li>Travel insurance packages</li>
                  <li>Loyalty point systems</li>
                  <li>Currency exchange services</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="benefits-section">
            <h2>🚀 Partnership Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">📈</div>
                <h3>Access to Growing Market</h3>
                <p>
                  Tap into our expanding network of travelers and local guides
                  across multiple destinations
                </p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <h3>Targeted Marketing</h3>
                <p>
                  Reach highly engaged travelers who are actively seeking
                  authentic local experiences
                </p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">💡</div>
                <h3>Innovation Collaboration</h3>
                <p>
                  Work together on cutting-edge solutions that shape the future
                  of travel
                </p>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🤝</div>
                <h3>Strategic Support</h3>
                <p>
                  Benefit from our expertise in local travel markets and guide
                  networks
                </p>
              </div>
            </div>
          </section>

          <section className="process-section">
            <h2>📋 Partnership Process</h2>
            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Initial Discussion</h3>
                  <p>
                    Reach out to us with your partnership proposal or explore
                    our partnership opportunities
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Proposal Review</h3>
                  <p>
                    Our partnerships team evaluates your proposal and assesses
                    mutual fit and benefits
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Negotiation</h3>
                  <p>
                    We work together to define partnership terms,
                    responsibilities, and success metrics
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Implementation</h3>
                  <p>
                    Launch the partnership with dedicated support and ongoing
                    collaboration
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="current-partners">
            <h2>🌟 Our Current Partners</h2>
            <p className="partners-intro">
              We're proud to work with leading organizations across the travel
              and technology industries
            </p>
            <div className="partners-grid">
              <div className="partner-logo">
                <div className="logo-placeholder">Travel Agency Pro</div>
                <p>Leading travel agency platform</p>
              </div>
              <div className="partner-logo">
                <div className="logo-placeholder">Hotel Connect</div>
                <p>Hotel management system</p>
              </div>
              <div className="partner-logo">
                <div className="logo-placeholder">Global University</div>
                <p>International education partner</p>
              </div>
              <div className="partner-logo">
                <div className="logo-placeholder">Tourism Board Asia</div>
                <p>Regional tourism promotion</p>
              </div>
            </div>
          </section>

          <section className="requirements-section">
            <h2>📜 Partnership Requirements</h2>
            <div className="requirements-content">
              <div className="requirements-column">
                <h3>Essential Requirements</h3>
                <ul>
                  <li>Established business with proven track record</li>
                  <li>Alignment with our values and mission</li>
                  <li>Commitment to quality and customer service</li>
                  <li>Legal compliance in operating jurisdictions</li>
                  <li>Technical capability for integration (if applicable)</li>
                </ul>
              </div>

              <div className="requirements-column">
                <h3>Preferred Qualifications</h3>
                <ul>
                  <li>Experience in travel or hospitality industry</li>
                  <li>Strong brand reputation and market presence</li>
                  <li>Innovative approach to customer experience</li>
                  <li>Sustainability and responsible travel focus</li>
                  <li>Multi-market or international presence</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-card">
              <h2>Ready to Partner with Us?</h2>
              <p>
                Let's explore how we can create amazing travel experiences
                together. Get in touch with our partnerships team to discuss
                opportunities.
              </p>
              <div className="cta-buttons">
                <Link to="/contact" className="contact-btn">
                  Contact Partnerships Team
                </Link>
                <a
                  href="mailto:partnerships@tourconnect.com"
                  className="email-btn"
                >
                  partnerships@tourconnect.com
                </a>
              </div>
              <div className="contact-info">
                <p>
                  <strong>Partnership Inquiries:</strong>{" "}
                  partnerships@tourconnect.com
                </p>
                <p>
                  <strong>Business Development:</strong> +1 (555) 123-4567
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PartnershipsPage;
