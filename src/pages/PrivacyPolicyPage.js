import React from "react";
import "./PrivacyPolicyPage.css";

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      <div className="privacy-container">
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: August 2, 2025</p>
        </div>

        <div className="privacy-content">
          <section className="privacy-section">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, book a tour, or contact us for support.
            </p>
            <ul>
              <li>Personal information (name, email, phone number)</li>
              <li>
                Payment information (processed securely through third-party
                providers)
              </li>
              <li>Travel preferences and booking history</li>
              <li>Communication records</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Process bookings and payments</li>
              <li>Communicate with you about your bookings</li>
              <li>Send you promotional materials (with your consent)</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except:
            </p>
            <ul>
              <li>To our tour guides to facilitate your bookings</li>
              <li>To trusted service providers who assist in our operations</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and personal data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="contact-info">
              <p>Email: privacy@tourconnect.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Travel Street, Adventure City, AC 12345</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
