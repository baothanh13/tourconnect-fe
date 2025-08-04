import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* TourConnect Section */}
          <div className="footer-section">
            <h3>TourConnect</h3>
            <ul>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/book-tour">Booking Process</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cancellation">Cancellation Policy</Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <ul>
              <li>
                <a
                  href="https://instagram.com/tourconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/tourconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/tourconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/tourconnect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          {/* Work With Us Section */}
          <div className="footer-section">
            <h3>Work With Us</h3>
            <ul>
              <li>
                <Link to="/become-guide">Tour Guide</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/affiliates">Affiliates</Link>
              </li>
              <li>
                <Link to="/partnerships">Partnerships</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h4>We Accept</h4>
          <div className="payment-icons">
            <div className="payment-card">💳 PayPal</div>
            <div className="payment-card">💳 Mastercard</div>
            <div className="payment-card">💳 Visa</div>
            <div className="payment-card">💳 Discover</div>
            <div className="payment-card">💳 American Express</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-logo">
            <Link to="/">
              <span className="logo-icon">🧭</span>
              <span className="logo-text">TourConnect</span>
            </Link>
          </div>
          <div className="footer-copyright">
            <p>© 2025 TourConnect. All rights reserved.</p>
          </div>
          <div className="footer-currency">
            <select className="currency-selector">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="VND">VND (₫)</option>
            </select>
          </div>
          <div className="back-to-top">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑ Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
