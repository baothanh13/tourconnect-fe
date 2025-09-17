import React from "react";
import "./Terms.css";

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <div className="terms-header">
          <h1>Terms & Conditions</h1>
          <p>Last updated: August 1, 2025</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using TourConnect's services, you acknowledge
              that you have read, understood, and agree to be bound by these
              Terms and Conditions. If you do not agree to these terms, please
              do not use our services.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Description of Service</h2>
            <p>
              TourConnect is an online marketplace that connects travelers with
              local tour guides. We provide a platform for:
            </p>
            <ul>
              <li>Browsing and booking tours with verified local guides</li>
              <li>Secure payment processing</li>
              <li>Communication tools between travelers and guides</li>
              <li>Review and rating systems</li>
              <li>Customer support services</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. User Accounts</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              To use our services, you must create an account with accurate
              information. You are responsible for maintaining the
              confidentiality of your account credentials.
            </p>
            <h3>3.2 Account Responsibilities</h3>
            <ul>
              <li>Provide accurate and up-to-date information</li>
              <li>Maintain security of your login credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Booking and Payment Terms</h2>
            <h3>4.1 Booking Process</h3>
            <p>
              When you book a tour through TourConnect, you enter into a direct
              agreement with the tour guide. TourConnect facilitates this
              transaction but is not a party to the tour service agreement.
            </p>
            <h3>4.2 Payment Terms</h3>
            <ul>
              <li>
                All payments must be made through our secure payment system
              </li>
              <li>Prices are displayed in the currency selected by the user</li>
              <li>
                Service fees and taxes will be clearly displayed before payment
              </li>
              <li>
                Payment is due at the time of booking unless otherwise specified
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Cancellation Policy</h2>
            <h3>5.1 Traveler Cancellations</h3>
            <ul>
              <li>
                <strong>Free cancellation:</strong> Up to 24 hours before tour
                start time
              </li>
              <li>
                <strong>50% refund:</strong> 12-24 hours before tour start time
              </li>
              <li>
                <strong>No refund:</strong> Less than 12 hours before tour start
                time
              </li>
            </ul>
            <h3>5.2 Guide Cancellations</h3>
            <p>
              If a guide cancels a confirmed booking, travelers are entitled to
              a full refund and TourConnect will assist in finding alternative
              arrangements when possible.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. Guide Responsibilities</h2>
            <h3>6.1 Service Standards</h3>
            <p>Tour guides using our platform must:</p>
            <ul>
              <li>Provide accurate information about their services</li>
              <li>Maintain professional conduct during all interactions</li>
              <li>
                Possess necessary licenses and permits as required by local law
              </li>
              <li>Maintain appropriate insurance coverage</li>
              <li>
                Respond to booking requests and messages in a timely manner
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. Prohibited Activities</h2>
            <p>The following activities are strictly prohibited:</p>
            <ul>
              <li>Circumventing our payment system</li>
              <li>Creating fake reviews or manipulating ratings</li>
              <li>
                Discriminating against users based on protected characteristics
              </li>
              <li>Engaging in any illegal activities</li>
              <li>Violating intellectual property rights</li>
              <li>Spamming or harassment of other users</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>8. Liability and Insurance</h2>
            <h3>8.1 Platform Liability</h3>
            <p>
              TourConnect acts as an intermediary platform. While we verify our
              guides, we are not liable for the actions of guides or the quality
              of tours provided.
            </p>
            <h3>8.2 Insurance Coverage</h3>
            <p>
              Basic insurance coverage is provided for all tours booked through
              our platform. Users are encouraged to purchase comprehensive
              travel insurance.
            </p>
          </section>

          <section className="terms-section">
            <h2>9. Intellectual Property</h2>
            <p>
              All content on the TourConnect platform, including but not limited
              to text, graphics, logos, and software, is the property of
              TourConnect or its licensors and is protected by copyright and
              other intellectual property laws.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your personal
              information.
            </p>
          </section>

          <section className="terms-section">
            <h2>11. Dispute Resolution</h2>
            <h3>11.1 Internal Resolution</h3>
            <p>
              We encourage users to resolve disputes directly. Our customer
              support team is available to mediate conflicts between travelers
              and guides.
            </p>
            <h3>11.2 Legal Disputes</h3>
            <p>
              Any legal disputes will be resolved through binding arbitration in
              accordance with the laws of Vietnam.
            </p>
          </section>

          <section className="terms-section">
            <h2>12. Modifications to Terms</h2>
            <p>
              TourConnect reserves the right to modify these terms at any time.
              Users will be notified of significant changes via email or
              platform notifications. Continued use of the service constitutes
              acceptance of modified terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>13. Termination</h2>
            <p>
              TourConnect may terminate or suspend accounts that violate these
              terms or engage in prohibited activities. Users may also terminate
              their accounts at any time through their account settings.
            </p>
          </section>

          <section className="terms-section">
            <h2>14. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us
              at:
            </p>
            <div className="contact-info">
              <p>
                <strong>Email:</strong> legal@tourconnect.com
              </p>
              <p>
                <strong>Address:</strong> 123 Nguyen Du Street, District 1, Ho
                Chi Minh City, Vietnam
              </p>
              <p>
                <strong>Phone:</strong> +84 (28) 123-4567
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
