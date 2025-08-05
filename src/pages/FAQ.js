import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqData = {
    general: [
      {
        question: "What is TourConnect?",
        answer:
          "TourConnect is a platform that connects travelers with verified local tour guides worldwide. We offer personalized, private tours tailored to your interests and preferences.",
      },
      {
        question: "How do I book a tour?",
        answer:
          "Simply browse our guide profiles, select your preferred guide, choose your tour dates, and make a secure payment. You can message your guide before booking to customize your tour.",
      },
      {
        question: "Are all guides verified?",
        answer:
          "Yes, all our guides go through a thorough verification process including background checks, skill assessments, and customer reviews.",
      },
    ],
    booking: [
      {
        question: "Can I cancel my booking?",
        answer:
          "Yes, you can cancel your booking according to our cancellation policy. Free cancellation is available up to 24 hours before your tour starts.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various local payment methods depending on your location.",
      },
      {
        question: "Do I need to pay upfront?",
        answer:
          "We require a small deposit to confirm your booking, with the remaining balance payable before or during your tour.",
      },
    ],
    guides: [
      {
        question: "How do I become a tour guide?",
        answer:
          "Apply through our 'Become a Guide' page, complete the verification process, and start hosting tours once approved. We provide training and support materials.",
      },
      {
        question: "What qualifications do guides need?",
        answer:
          "Guides need local expertise, good communication skills, and relevant certifications. We also require clean background checks and positive references.",
      },
      {
        question: "How much do guides earn?",
        answer:
          "Guides set their own rates and keep 80% of the tour price. Earnings vary based on location, tour type, and frequency of bookings.",
      },
    ],
    safety: [
      {
        question: "Is it safe to book with TourConnect?",
        answer:
          "Absolutely. All guides are verified, we provide insurance coverage, and have 24/7 emergency support during tours.",
      },
      {
        question: "What if something goes wrong during my tour?",
        answer:
          "Contact our emergency support line immediately. We have protocols in place and insurance coverage for various situations.",
      },
      {
        question: "Do you provide travel insurance?",
        answer:
          "We include basic coverage for all tours. We recommend travelers purchase comprehensive travel insurance for international trips.",
      },
    ],
  };

  const categories = [
    { key: "general", label: "General", icon: "❓" },
    { key: "booking", label: "Booking", icon: "🎫" },
    { key: "guides", label: "For Guides", icon: "🧑‍🏫" },
    { key: "safety", label: "Safety", icon: "🛡️" },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container">
        {/* Hero Section */}
        <section className="faq-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about TourConnect</p>
        </section>

        {/* Search Bar */}
        <div className="faq-search">
          <input
            type="text"
            placeholder="Search for answers..."
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="faq-content">
          {/* Categories */}
          <div className="faq-categories">
            {categories.map((category) => (
              <button
                key={category.key}
                className={`category-btn ${
                  activeCategory === category.key ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category.key)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="faq-list">
            {faqData[activeCategory].map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span
                    className={`toggle-icon ${openFAQ === index ? "open" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <section className="faq-contact">
          <h2>Still have questions?</h2>
          <p>
            Our support team is here to help you with any additional questions.
          </p>
          <div className="contact-buttons">
            <a href="/contact" className="btn-primary">
              Contact Support
            </a>
            <a href="tel:+842812345" className="btn-secondary">
              Call Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
