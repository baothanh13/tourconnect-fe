import React, { useState } from "react";
import "./HelpCenterPage.css";

const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Getting Started",
    "Booking",
    "Payment",
    "Guides",
    "Account",
    "Safety",
  ];

  const articles = [
    {
      id: 1,
      title: "How to book your first tour",
      category: "Getting Started",
      content:
        "Learn the step-by-step process of booking your perfect tour experience...",
      views: 1250,
      helpful: 98,
    },
    {
      id: 2,
      title: "Payment methods and refund policy",
      category: "Payment",
      content: "Understanding our payment options and refund procedures...",
      views: 890,
      helpful: 94,
    },
    {
      id: 3,
      title: "How to become a guide",
      category: "Guides",
      content:
        "Everything you need to know about joining our guide community...",
      views: 2100,
      helpful: 96,
    },
    {
      id: 4,
      title: "Managing your account settings",
      category: "Account",
      content: "Learn how to update your profile, preferences, and settings...",
      views: 756,
      helpful: 92,
    },
    {
      id: 5,
      title: "Safety guidelines for travelers",
      category: "Safety",
      content: "Important safety tips and guidelines for your travels...",
      views: 1450,
      helpful: 99,
    },
    {
      id: 6,
      title: "Cancellation and rescheduling",
      category: "Booking",
      content: "How to cancel or reschedule your booking...",
      views: 1120,
      helpful: 90,
    },
  ];

  const faqs = [
    {
      question: "How do I book a tour?",
      answer:
        "Simply browse our guides, select your preferred tour, choose your dates, and complete the payment process. You'll receive confirmation via email.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking up to 48 hours before the tour start time for a full refund. Cancellations within 48 hours are subject to our cancellation policy.",
    },
    {
      question: "How do I contact my guide?",
      answer:
        "Once your booking is confirmed, you'll receive your guide's contact information and can message them directly through our platform.",
    },
    {
      question: "What if I need to reschedule?",
      answer:
        "You can reschedule your tour up to 24 hours before the start time, subject to your guide's availability.",
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="help-center-page">
      {/* Hero Section */}
      <div className="help-hero">
        <div className="help-hero-content">
          <h1>How can we help you?</h1>
          <p>Find answers to your questions and get the support you need</p>
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="quick-help-section">
        <div className="quick-help-container">
          <h2>Quick Help</h2>
          <div className="quick-help-grid">
            <div className="quick-help-card">
              <div className="help-icon">📚</div>
              <h3>Getting Started</h3>
              <p>New to TourConnect? Learn the basics</p>
              <button>Learn More</button>
            </div>
            <div className="quick-help-card">
              <div className="help-icon">💳</div>
              <h3>Booking & Payment</h3>
              <p>Questions about bookings and payments</p>
              <button>Learn More</button>
            </div>
            <div className="quick-help-card">
              <div className="help-icon">🛡️</div>
              <h3>Safety & Security</h3>
              <p>Your safety is our priority</p>
              <button>Learn More</button>
            </div>
            <div className="quick-help-card">
              <div className="help-icon">📞</div>
              <h3>Contact Support</h3>
              <p>Need personalized help?</p>
              <button>Contact Us</button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="faq-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={index} className="faq-item">
                <summary className="faq-question">
                  {faq.question}
                  <span className="faq-icon">+</span>
                </summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Help Articles */}
      <div className="articles-section">
        <div className="articles-container">
          <h2>Help Articles</h2>

          <div className="article-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-category">{article.category}</div>
                <h3>{article.title}</h3>
                <p>{article.content}</p>
                <div className="article-stats">
                  <span className="views">👁️ {article.views} views</span>
                  <span className="helpful">👍 {article.helpful}% helpful</span>
                </div>
                <button className="read-more-btn">Read More</button>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="no-articles">
              <h3>No articles found</h3>
              <p>Try adjusting your search or browsing different categories</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-container">
          <h2>Still Need Help?</h2>
          <p>Our support team is here to assist you 24/7</p>

          <div className="contact-options">
            <div className="contact-option">
              <div className="contact-icon">💬</div>
              <h3>Live Chat</h3>
              <p>Get instant help from our support team</p>
              <button className="contact-btn">Start Chat</button>
            </div>

            <div className="contact-option">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>Send us a detailed message</p>
              <button className="contact-btn">Send Email</button>
            </div>

            <div className="contact-option">
              <div className="contact-icon">📞</div>
              <h3>Phone Support</h3>
              <p>Speak directly with our team</p>
              <button className="contact-btn">Call Now</button>
            </div>
          </div>

          <div className="support-hours">
            <h3>Support Hours</h3>
            <div className="hours-grid">
              <div className="hours-item">
                <strong>Chat & Email:</strong> 24/7
              </div>
              <div className="hours-item">
                <strong>Phone:</strong> Mon-Fri 9AM-8PM EST
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="feedback-section">
        <div className="feedback-container">
          <h2>Help Us Improve</h2>
          <p>
            Was this page helpful? Your feedback helps us create better support
            resources.
          </p>

          <div className="feedback-buttons">
            <button className="feedback-btn positive">👍 Yes, helpful</button>
            <button className="feedback-btn negative">👎 Not helpful</button>
          </div>

          <div className="feedback-form">
            <textarea placeholder="Tell us how we can improve this page..."></textarea>
            <button className="submit-feedback-btn">Submit Feedback</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
