import React, { useState } from "react";
import "./BecomeGuide.css";

const BecomeGuide = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    languages: [],
    experience: "",
    specialties: [],
    description: "",
    hasLicense: false,
    hasInsurance: false,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "Application submitted! We will review your application and contact you within 48 hours."
    );
  };

  const languages = [
    "English",
    "Vietnamese",
    "Chinese",
    "Japanese",
    "Korean",
    "French",
    "Spanish",
    "German",
  ];
  const specialtiesOptions = [
    "Cultural Tours",
    "Food Tours",
    "Adventure Tours",
    "Historical Sites",
    "Photography Tours",
    "Nature Tours",
    "City Tours",
    "Beach Tours",
  ];

  return (
    <div className="become-guide-page">
      <div className="container">
        {/* Hero Section */}
        <section className="guide-hero">
          <h1>Become a TourConnect Guide</h1>
          <p>
            Share your passion for your city and earn money doing what you love
          </p>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2>Why Join TourConnect?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Earn Great Money</h3>
              <p>Keep 80% of your tour earnings with flexible pricing</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Easy Platform</h3>
              <p>
                User-friendly tools to manage bookings and communicate with
                travelers
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🌍</div>
              <h3>Meet Amazing People</h3>
              <p>Connect with travelers from around the world</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Full Support</h3>
              <p>Insurance coverage, 24/7 support, and marketing assistance</p>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="requirements-section">
          <h2>Guide Requirements</h2>
          <div className="requirements-list">
            <div className="requirement-item">
              <span className="check-icon">✅</span>
              <div>
                <h3>Local Expertise</h3>
                <p>
                  Deep knowledge of your city's history, culture, and
                  attractions
                </p>
              </div>
            </div>
            <div className="requirement-item">
              <span className="check-icon">✅</span>
              <div>
                <h3>Language Skills</h3>
                <p>Fluency in at least one international language</p>
              </div>
            </div>
            <div className="requirement-item">
              <span className="check-icon">✅</span>
              <div>
                <h3>Clean Background</h3>
                <p>Pass our verification process and background check</p>
              </div>
            </div>
            <div className="requirement-item">
              <span className="check-icon">✅</span>
              <div>
                <h3>Communication Skills</h3>
                <p>Excellent interpersonal and storytelling abilities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="application-section">
          <h2>Apply Now</h2>
          <form onSubmit={handleSubmit} className="guide-application-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Languages Spoken *</label>
              <div className="checkbox-group">
                {languages.map((lang) => (
                  <label key={lang} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleMultiSelect("languages", lang)}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Guiding Experience *</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner (0-1 years)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="experienced">Experienced (3-5 years)</option>
                <option value="expert">Expert (5+ years)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tour Specialties *</label>
              <div className="checkbox-group">
                {specialtiesOptions.map((specialty) => (
                  <label key={specialty} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() =>
                        handleMultiSelect("specialties", specialty)
                      }
                    />
                    {specialty}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Tell us about yourself *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your background, passion for guiding, and what makes you unique..."
                required
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasLicense"
                  checked={formData.hasLicense}
                  onChange={handleChange}
                />
                I have a valid tour guide license (if required in my area)
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={handleChange}
                />
                I have liability insurance coverage
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                I agree to the <a href="/terms">Terms & Conditions</a> and{" "}
                <a href="/privacy">Privacy Policy</a> *
              </label>
            </div>

            <button type="submit" className="submit-application-btn">
              Submit Application
            </button>
          </form>
        </section>

        {/* Process Timeline */}
        <section className="process-section">
          <h2>Application Process</h2>
          <div className="process-timeline">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Submit Application</h3>
                <p>Complete the form with your details and experience</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Initial Review</h3>
                <p>Our team reviews your application within 48 hours</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Interview & Verification</h3>
                <p>Video interview and background check process</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Training & Onboarding</h3>
                <p>Complete our guide training program</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Start Guiding</h3>
                <p>Launch your profile and start hosting tours!</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BecomeGuide;
