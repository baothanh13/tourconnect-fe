import React from "react";
import { Link } from "react-router-dom";
import "./AffiliatesPage.css";

const AffiliatesPage = () => {
  return (
    <div className="affiliates-page">
      <div className="page-header">
        <div className="container">
          <h1>Affiliate Program</h1>
          <p>
            Partner with TourConnect and earn commissions by promoting authentic
            travel experiences
          </p>
        </div>
      </div>

      <div className="container">
        <div className="affiliates-content">
          <section className="intro-section">
            <h2>🤝 Join Our Affiliate Network</h2>
            <p>
              Become a TourConnect affiliate and earn money by promoting unique
              local experiences to your audience. Whether you're a travel
              blogger, influencer, or business owner, our affiliate program
              offers competitive commissions and marketing support.
            </p>
          </section>

          <section className="benefits-section">
            <h2>💰 Program Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">💵</div>
                <h3>Competitive Commissions</h3>
                <p>
                  Earn up to 10% commission on every successful booking you
                  refer
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>Real-time Analytics</h3>
                <p>
                  Track your performance with detailed reporting and analytics
                  dashboard
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <h3>Marketing Materials</h3>
                <p>
                  Access banners, content, and promotional materials to boost
                  conversions
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">💳</div>
                <h3>Monthly Payouts</h3>
                <p>
                  Receive payments monthly via PayPal, bank transfer, or other
                  methods
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🔗</div>
                <h3>Custom Links</h3>
                <p>
                  Get personalized tracking links and discount codes for your
                  audience
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🎧</div>
                <h3>Dedicated Support</h3>
                <p>
                  Access to dedicated affiliate managers and priority customer
                  support
                </p>
              </div>
            </div>
          </section>

          <section className="commission-structure">
            <h2>📈 Commission Structure</h2>
            <div className="commission-tiers">
              <div className="tier-card">
                <h3>Starter</h3>
                <div className="commission-rate">5%</div>
                <p>0-10 bookings per month</p>
                <ul>
                  <li>Basic marketing materials</li>
                  <li>Monthly reporting</li>
                  <li>Email support</li>
                </ul>
              </div>

              <div className="tier-card featured">
                <h3>Professional</h3>
                <div className="commission-rate">8%</div>
                <p>11-25 bookings per month</p>
                <ul>
                  <li>Advanced marketing kit</li>
                  <li>Weekly reporting</li>
                  <li>Priority support</li>
                  <li>Custom banners</li>
                </ul>
              </div>

              <div className="tier-card">
                <h3>Elite</h3>
                <div className="commission-rate">10%</div>
                <p>25+ bookings per month</p>
                <ul>
                  <li>Full marketing suite</li>
                  <li>Real-time reporting</li>
                  <li>Dedicated manager</li>
                  <li>Custom campaigns</li>
                  <li>Early access to new features</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="who-can-join">
            <h2>👥 Who Can Join?</h2>
            <div className="audience-types">
              <div className="audience-card">
                <h3>🌍 Travel Bloggers</h3>
                <p>
                  Share authentic local experiences with your travel-loving
                  audience
                </p>
              </div>

              <div className="audience-card">
                <h3>📱 Social Media Influencers</h3>
                <p>Promote unique tours and experiences to your followers</p>
              </div>

              <div className="audience-card">
                <h3>🏢 Travel Agencies</h3>
                <p>Expand your offerings with local guided experiences</p>
              </div>

              <div className="audience-card">
                <h3>🖥️ Website Owners</h3>
                <p>Monetize your travel or lifestyle website traffic</p>
              </div>

              <div className="audience-card">
                <h3>📧 Email Marketers</h3>
                <p>Promote travel experiences to your subscriber base</p>
              </div>

              <div className="audience-card">
                <h3>🎓 Educational Content Creators</h3>
                <p>Share cultural and educational travel experiences</p>
              </div>
            </div>
          </section>

          <section className="requirements">
            <h2>📋 Requirements</h2>
            <div className="requirements-list">
              <div className="requirement-item">
                <span className="check-icon">✅</span>
                <span>Active website, blog, or social media presence</span>
              </div>
              <div className="requirement-item">
                <span className="check-icon">✅</span>
                <span>Relevant audience interested in travel/experiences</span>
              </div>
              <div className="requirement-item">
                <span className="check-icon">✅</span>
                <span>Commitment to ethical marketing practices</span>
              </div>
              <div className="requirement-item">
                <span className="check-icon">✅</span>
                <span>18+ years old with valid ID</span>
              </div>
              <div className="requirement-item">
                <span className="check-icon">✅</span>
                <span>Agree to our terms and conditions</span>
              </div>
            </div>
          </section>

          <section className="getting-started">
            <h2>🚀 How to Get Started</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Apply</h3>
                <p>
                  Fill out our affiliate application form with your details and
                  platform information
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Get Approved</h3>
                <p>
                  Our team reviews your application (usually within 2-3 business
                  days)
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Access Dashboard</h3>
                <p>
                  Login to your affiliate dashboard and get your unique tracking
                  links
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">4</div>
                <h3>Start Earning</h3>
                <p>
                  Promote tours and experiences, track your performance, and
                  earn commissions
                </p>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="cta-card">
              <h2>Ready to Start Earning?</h2>
              <p>
                Join thousands of affiliates already earning with TourConnect.
                Apply now and start monetizing your audience today!
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="apply-btn">
                  Apply Now
                </Link>
                <Link to="/contact" className="contact-btn">
                  Ask Questions
                </Link>
              </div>
              <p className="cta-note">
                Have questions?{" "}
                <Link to="/contact">Contact our affiliate team</Link> - we're
                here to help!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AffiliatesPage;
