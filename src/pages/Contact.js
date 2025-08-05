import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    });
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Hero Section */}
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>We're here to help you with any questions or concerns</p>
        </section>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Support</option>
                    <option value="guide">Guide Application</option>
                    <option value="technical">Technical Issue</option>
                    <option value="partnership">Partnership</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Get in Touch</h2>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div className="method-content">
                  <h3>Email Support</h3>
                  <p>support@tourconnect.com</p>
                  <span>Response within 24 hours</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">📞</div>
                <div className="method-content">
                  <h3>Phone Support</h3>
                  <p>+84 (28) 123-4567</p>
                  <span>Mon-Fri: 9AM-6PM (GMT+7)</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">💬</div>
                <div className="method-content">
                  <h3>Live Chat</h3>
                  <p>Available on our website</p>
                  <span>Mon-Fri: 9AM-6PM (GMT+7)</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">📍</div>
                <div className="method-content">
                  <h3>Office Address</h3>
                  <p>
                    123 Nguyen Du Street
                    <br />
                    District 1, Ho Chi Minh City
                    <br />
                    Vietnam
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="faq-link">
              <h3>Looking for Quick Answers?</h3>
              <p>
                Check our comprehensive FAQ section for instant solutions to
                common questions.
              </p>
              <a href="/faq" className="btn-secondary">
                Visit FAQ
              </a>
            </div>

            {/* Emergency Contact */}
            <div className="emergency-contact">
              <h3>🚨 Emergency Support</h3>
              <p>For urgent matters during your tour:</p>
              <p className="emergency-number">+84 (90) 123-4567</p>
              <span>Available 24/7</span>
            </div>
          </div>
        </div>

        {/* Response Time Information */}
        <section className="response-times">
          <h2>Our Response Times</h2>
          <div className="response-grid">
            <div className="response-item">
              <div className="response-icon">⚡</div>
              <h3>General Inquiries</h3>
              <p>Within 24 hours</p>
            </div>
            <div className="response-item">
              <div className="response-icon">🎫</div>
              <h3>Booking Issues</h3>
              <p>Within 4 hours</p>
            </div>
            <div className="response-item">
              <div className="response-icon">🚨</div>
              <h3>Urgent Matters</h3>
              <p>Within 1 hour</p>
            </div>
            <div className="response-item">
              <div className="response-icon">🤝</div>
              <h3>Partnership Requests</h3>
              <p>Within 48 hours</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
