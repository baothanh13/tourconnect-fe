import React from "react";
import { Link } from "react-router-dom";
import "./CancellationPolicyPage.css";

const CancellationPolicyPage = () => {
  return (
    <div className="cancellation-policy-page">
      <div className="page-header">
        <div className="container">
          <h1>Cancellation Policy</h1>
          <p>Understanding our booking cancellation terms and conditions</p>
        </div>
      </div>

      <div className="container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>📋 Overview</h2>
            <p>
              At TourConnect, we understand that travel plans can change. Our
              cancellation policy is designed to be fair to both travelers and
              tour guides while ensuring the best possible experience for
              everyone.
            </p>
          </section>

          <section className="policy-section">
            <h2>⏰ Cancellation Timeline</h2>

            <div className="timeline-item">
              <h3>24+ Hours Before Tour</h3>
              <div className="refund-amount">100% Refund</div>
              <p>
                Cancel at least 24 hours before your scheduled tour start time
                for a full refund.
              </p>
            </div>

            <div className="timeline-item">
              <h3>12-24 Hours Before Tour</h3>
              <div className="refund-amount">50% Refund</div>
              <p>
                Cancellations between 12-24 hours before the tour will receive a
                50% refund.
              </p>
            </div>

            <div className="timeline-item">
              <h3>Less Than 12 Hours</h3>
              <div className="refund-amount">No Refund</div>
              <p>
                Cancellations made less than 12 hours before the tour are
                non-refundable.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>🌧️ Weather Cancellations</h2>
            <p>
              If weather conditions make the tour unsafe or significantly impact
              the experience, we offer the following options:
            </p>
            <ul>
              <li>Full refund of your booking</li>
              <li>Reschedule to another available date</li>
              <li>Tour modification to indoor activities (when applicable)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>🏥 Emergency Cancellations</h2>
            <p>
              We understand that emergencies happen. In case of medical
              emergencies, family emergencies, or other unforeseen
              circumstances, please contact our support team. We will review
              each case individually and may offer:
            </p>
            <ul>
              <li>Full or partial refund</li>
              <li>Tour credit for future use</li>
              <li>Free rescheduling options</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>👨‍🏫 Guide-Initiated Cancellations</h2>
            <p>If your tour guide needs to cancel for any reason:</p>
            <ul>
              <li>You will receive a full refund immediately</li>
              <li>We will help you find an alternative guide</li>
              <li>You may receive a discount on your next booking</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>💳 Refund Process</h2>
            <p>Approved refunds will be processed as follows:</p>
            <ul>
              <li>Credit card payments: 3-5 business days</li>
              <li>PayPal payments: 1-2 business days</li>
              <li>Bank transfers: 5-7 business days</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>📞 How to Cancel</h2>
            <div className="cancellation-methods">
              <div className="method-card">
                <h3>🌐 Online</h3>
                <p>
                  Log into your account and cancel from your bookings dashboard
                </p>
              </div>

              <div className="method-card">
                <h3>📧 Email</h3>
                <p>Send cancellation request to support@tourconnect.com</p>
              </div>

              <div className="method-card">
                <h3>📱 Phone</h3>
                <p>Call our support team at +1 (555) 123-4567</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>❓ Special Circumstances</h2>
            <p>
              For group bookings (5+ people), private tours, or multi-day
              experiences, special cancellation terms may apply. Please refer to
              your booking confirmation or contact our support team for specific
              details.
            </p>
          </section>

          <section className="policy-section">
            <h2>📜 Policy Updates</h2>
            <p>
              This cancellation policy may be updated from time to time. Any
              changes will be posted on this page with an updated effective
              date. Bookings made before policy changes will be subject to the
              terms in effect at the time of booking.
            </p>
            <p className="update-date">
              <strong>Last updated:</strong> August 12, 2025
            </p>
          </section>

          <div className="contact-support">
            <h3>Need Help?</h3>
            <p>
              If you have questions about our cancellation policy or need
              assistance with a cancellation, our support team is here to help.
            </p>
            <div className="support-links">
              <Link to="/help" className="support-btn">
                Visit Help Center
              </Link>
              <Link to="/contact" className="support-btn">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyPage;
