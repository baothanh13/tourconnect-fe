import React from "react";
import {
  FaUsers,
  FaHeart,
  FaGlobe,
  FaShieldAlt,
  FaRocket,
  FaHandshake,
} from "react-icons/fa";
import "./About_new.css";

const About = () => {
  const teamMembers = [
    {
      name: "Phan Quy Bao Thanh",
      role: "Founder & CEO",
      description:
        "Visionary leader passionate about connecting travelers with authentic Vietnamese experiences",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialization: "Tourism Strategy & Business Development",
    },
    {
      name: "Dang Minh Tien",
      role: "CTO & Co-Founder",
      description:
        "Technology expert building innovative solutions for seamless travel experiences",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialization: "Full-Stack Development & Platform Architecture",
    },
    {
      name: "Pham Cong Tru",
      role: "Head of Operations",
      description:
        "Operations specialist ensuring quality and safety standards across all Vietnamese tours",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
      specialization: "Tour Operations & Quality Assurance",
    },
  ];

  const companyValues = [
    {
      icon: <FaHeart />,
      title: "Authentic Cultural Exchange",
      description:
        "We believe the best way to experience Vietnam is through the eyes and stories of passionate locals who call it home.",
    },
    {
      icon: <FaUsers />,
      title: "Community Empowerment",
      description:
        "Supporting Vietnamese guides and local communities by creating sustainable income opportunities through tourism.",
    },
    {
      icon: <FaGlobe />,
      title: "Sustainable Tourism",
      description:
        "Promoting responsible travel that preserves Vietnam's cultural heritage and natural beauty for future generations.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Trust & Safety First",
      description:
        "Every guide is carefully verified with comprehensive insurance coverage ensuring safe, reliable experiences.",
    },
  ];

  const milestones = [
    {
      year: "2025",
      event: "TourConnect Founded",
      description:
        "Started with a vision to revolutionize Vietnam's local tourism",
    },
    {
      year: "2025",
      event: "First 50 Guides",
      description:
        "Onboarded passionate local guides across major Vietnamese cities",
    },
    {
      year: "2025",
      event: "1,000+ Tours",
      description:
        "Successfully connected travelers with authentic Vietnamese experiences",
    },
    {
      year: "2025",
      event: "Platform Launch",
      description:
        "Launched comprehensive booking platform for seamless tour discovery",
    },
  ];

  return (
    <div className="about-page-modern">
      {/* Modern Hero Section */}
      <section className="about-hero-modern">
        <div className="hero-background-about">
          <div className="hero-particles-about"></div>
        </div>
        <div className="about-hero-content">
          <div className="hero-badge-about">
            <FaRocket />
            <span>Connecting Cultures Since 2025</span>
          </div>
          <h1>About TourConnect</h1>
          <p>
            We're revolutionizing Vietnam's tourism by connecting international
            travelers with passionate local guides who share authentic cultural
            experiences and hidden gems.
          </p>
          <div className="hero-stats-about">
            <div className="stat-about">
              <h3>200+</h3>
              <p>Local Guides</p>
            </div>
            <div className="stat-about">
              <h3>5,000+</h3>
              <p>Happy Travelers</p>
            </div>
            <div className="stat-about">
              <h3>15+</h3>
              <p>Vietnamese Cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story-section-modern">
        <div className="story-container">
          <div className="story-content-modern">
            <div className="story-text-modern">
              <h2>Our Story</h2>
              <p>
                Founded in 2025 by three passionate Vietnamese entrepreneurs,
                TourConnect was born from a simple yet powerful vision: to
                showcase the real Vietnam through the eyes of locals who know
                and love their homeland.
              </p>
              <p>
                We recognized that the best travel experiences come from
                authentic connections with local people who can share not just
                the famous attractions, but the hidden stories, secret spots,
                and cultural nuances that make Vietnam truly special.
              </p>
              <p>
                Today, we're proud to be Vietnam's leading platform connecting
                travelers with verified local guides across Ho Chi Minh City,
                Hanoi, Hoi An, Da Nang, and beyond.
              </p>
            </div>
            <div className="story-image-modern">
              <img
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Vietnamese local guide showing Hoi An to travelers"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section-modern">
        <div className="values-container">
          <div className="section-header-about">
            <h2>Our Values</h2>
            <p>The principles that guide everything we do at TourConnect</p>
          </div>
          <div className="values-grid-modern">
            {companyValues.map((value, index) => (
              <div key={index} className="value-card-about">
                <div className="value-icon-about">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section-modern">
        <div className="timeline-container">
          <div className="section-header-about">
            <h2>Our Journey</h2>
            <p>
              Key milestones in building Vietnam's premier local guide platform
            </p>
          </div>
          <div className="timeline-modern">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item-modern">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.event}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section-modern">
        <div className="team-container">
          <div className="section-header-about">
            <h2>Meet Our Team</h2>
            <p>The passionate minds behind TourConnect's mission</p>
          </div>
          <div className="team-grid-modern">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card-modern">
                <div className="member-image-container">
                  <img src={member.image} alt={member.name} />
                  <div className="member-overlay">
                    <div className="member-social">
                      <FaHandshake />
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-role">{member.role}</div>
                  <p>{member.description}</p>
                  <div className="member-specialization">
                    <strong>Specialty:</strong> {member.specialization}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section-modern">
        <div className="impact-container">
          <div className="impact-content">
            <div className="impact-text">
              <h2>Our Impact on Vietnamese Tourism</h2>
              <p>
                TourConnect is more than a booking platform - we're building
                bridges between cultures and creating economic opportunities for
                Vietnamese communities.
              </p>
              <div className="impact-stats">
                <div className="impact-stat">
                  <div className="impact-number">₫50M+</div>
                  <div className="impact-label">Earned by Local Guides</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-number">95%</div>
                  <div className="impact-label">Guide Satisfaction Rate</div>
                </div>
              </div>
            </div>
            <div className="impact-image">
              <img
                src="https://images.unsplash.com/photo-1509923936403-148b60b94328?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Vietnamese guide and tourists exploring together"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-about">
        <div className="cta-container-about">
          <div className="cta-content-about">
            <h2>Ready to Experience the Real Vietnam?</h2>
            <p>
              Join thousands of travelers who've discovered authentic Vietnamese
              culture through our passionate local guides.
            </p>
            <div className="cta-buttons-about">
              <a href="/guides" className="btn-primary-about">
                <FaUsers />
                Find Your Guide
              </a>
              <a href="/careers" className="btn-secondary-about">
                <FaRocket />
                Join Our Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
