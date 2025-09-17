import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaHeart,
  FaUsers,
  FaRocket,
  FaGlobe,
} from "react-icons/fa";
import "./CareersPage_new.css";

const CareersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const jobCategories = [
    "All",
    "Tour Guides",
    "Support Staff",
    "Operations",
    "Marketing",
    "Customer Service",
  ];

  const jobs = [
    // Tour Guide Positions
    {
      id: 1,
      title: "Food Tour Guide",
      category: "Tour Guides",
      location: "Ho Chi Minh City",
      type: "Part-time/Full-time",
      level: "Entry-level",
      salary: "$20 - $40 per tour",
      description:
        "Lead authentic Vietnamese food tours through local markets, street food stalls, and hidden culinary gems. Share your passion for Vietnamese cuisine with international travelers.",
      requirements: [
        "Deep knowledge of Vietnamese cuisine and food culture",
        "Fluent English communication skills",
        "Friendly, outgoing personality",
        "Food safety awareness",
        "Local market connections preferred",
      ],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Cultural Heritage Tour Guide",
      category: "Tour Guides",
      location: "Hoi An",
      type: "Part-time/Full-time",
      level: "Entry-level",
      salary: "$25 - $45 per tour",
      description:
        "Guide visitors through Hoi An's ancient town, temples, and traditional craft workshops. Share stories about Vietnamese history, culture, and traditions.",
      requirements: [
        "Knowledge of Vietnamese history and culture",
        "Storytelling abilities",
        "English proficiency required",
        "Patient and educational approach",
        "Tourism certification preferred",
      ],
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Adventure & Nature Guide",
      category: "Tour Guides",
      location: "Sapa / Da Nang",
      type: "Full-time",
      level: "Mid-level",
      salary: "$30 - $60 per tour",
      description:
        "Lead trekking, hiking, and nature tours through Vietnam's mountains, rice terraces, and coastal areas. Ensure tourist safety while showcasing natural beauty.",
      requirements: [
        "Physical fitness and outdoor experience",
        "First aid certification required",
        "Navigation and safety skills",
        "English communication skills",
        "Mountaineering/hiking experience preferred",
      ],
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "City Walking Tour Guide",
      category: "Tour Guides",
      location: "Hanoi",
      type: "Part-time/Full-time",
      level: "Entry-level",
      salary: "$20 - $35 per tour",
      description:
        "Conduct walking tours through Hanoi's Old Quarter, highlighting historical sites, local life, and hidden gems only locals know about.",
      requirements: [
        "Extensive knowledge of Hanoi history",
        "Strong walking stamina",
        "Engaging presentation skills",
        "English fluency required",
        "Photography skills a plus",
      ],
      posted: "5 days ago",
    },
    {
      id: 5,
      title: "Motorbike Tour Guide",
      category: "Tour Guides",
      location: "Ho Chi Minh City / Hanoi",
      type: "Full-time",
      level: "Mid-level",
      salary: "$35 - $55 per tour",
      description:
        "Lead safe motorbike tours through city streets and countryside, showing travelers authentic Vietnamese life from a local perspective.",
      requirements: [
        "Valid motorcycle license (A2 minimum)",
        "3+ years riding experience",
        "Excellent safety record",
        "English communication skills",
        "Defensive driving techniques",
      ],
      posted: "1 week ago",
    },
    {
      id: 6,
      title: "Night Life & Entertainment Guide",
      category: "Tour Guides",
      location: "Ho Chi Minh City",
      type: "Part-time",
      level: "Entry-level",
      salary: "$25 - $40 per tour",
      description:
        "Show visitors the best of Saigon's nightlife - from rooftop bars to local beer corners, night markets, and entertainment districts.",
      requirements: [
        "Knowledge of local nightlife scene",
        "Responsible alcohol service awareness",
        "Night shift availability",
        "English proficiency",
        "Age 23+ required",
      ],
      posted: "4 days ago",
    },
    // Support Staff Positions
    {
      id: 7,
      title: "Tour Operations Coordinator",
      category: "Support Staff",
      location: "Remote / Ho Chi Minh City",
      type: "Full-time",
      level: "Mid-level",
      salary: "$600 - $900/month",
      description:
        "Support tour guides and manage daily operations including bookings, scheduling, guide assignments, and customer communication.",
      requirements: [
        "Operations or hospitality experience",
        "Excellent organizational skills",
        "Vietnamese and English fluency",
        "Customer service orientation",
        "Computer proficiency required",
      ],
      posted: "2 days ago",
    },
    {
      id: 8,
      title: "Guide Training & Development Specialist",
      category: "Support Staff",
      location: "Ho Chi Minh City",
      type: "Full-time",
      level: "Senior",
      salary: "$800 - $1200/month",
      description:
        "Train new guides, develop tour content, ensure service quality standards, and provide ongoing coaching to our guide network.",
      requirements: [
        "Training or hospitality background",
        "Leadership and mentoring skills",
        "Tourism industry experience",
        "Presentation and communication skills",
        "Quality assessment experience",
      ],
      posted: "1 week ago",
    },
    {
      id: 9,
      title: "Customer Experience Specialist",
      category: "Customer Service",
      location: "Remote",
      type: "Full-time",
      level: "Entry-level",
      salary: "$500 - $700/month",
      description:
        "Handle customer inquiries, booking support, tour modifications, and ensure exceptional customer service throughout the travel experience.",
      requirements: [
        "Strong customer service skills",
        "Problem-solving abilities",
        "Vietnamese and English fluency",
        "Patience and empathy",
        "Computer and phone skills",
      ],
      posted: "3 days ago",
    },
    {
      id: 10,
      title: "Marketing Content Creator",
      category: "Marketing",
      location: "Remote / Da Nang",
      type: "Part-time/Full-time",
      level: "Entry-level",
      salary: "$400 - $700/month",
      description:
        "Create engaging content for social media, write tour descriptions, take photos/videos of tours, and help promote TourConnect's experiences.",
      requirements: [
        "Content creation skills",
        "Photography/videography experience",
        "Social media knowledge",
        "Creative writing abilities",
        "Understanding of tourism marketing",
      ],
      posted: "5 days ago",
    },
    {
      id: 11,
      title: "Local Partnership Manager",
      category: "Operations",
      location: "Multiple Cities",
      type: "Full-time",
      level: "Mid-level",
      salary: "$700 - $1000/month",
      description:
        "Build relationships with restaurants, attractions, hotels, and local businesses to create better tour experiences and partnerships.",
      requirements: [
        "Business development experience",
        "Strong networking skills",
        "Vietnamese business culture knowledge",
        "Negotiation abilities",
        "Travel flexibility required",
      ],
      posted: "1 week ago",
    },
  ];

  const benefits = [
    {
      icon: <FaHeart />,
      title: "Flexible Schedule",
      description:
        "Choose your own tours and working hours - perfect for work-life balance",
    },
    {
      icon: <FaGlobe />,
      title: "Cultural Exchange",
      description:
        "Meet people from around the world and share your Vietnamese culture daily",
    },
    {
      icon: <FaUsers />,
      title: "Guide Community",
      description:
        "Join a supportive network of fellow guides with regular meetups and training",
    },
    {
      icon: <FaRocket />,
      title: "Skill Development",
      description:
        "Free training programs, language classes, and professional development opportunities",
    },
    {
      title: "Competitive Earnings",
      description:
        "Earn $20-60 per tour plus tips - higher rates for specialized tours and experience",
    },
    {
      title: "Equipment Provided",
      description:
        "Free branded uniforms, first aid kits, and tour equipment provided",
    },
    {
      title: "Insurance Coverage",
      description:
        "Tour liability insurance and accident coverage for all guides",
    },
    {
      title: "Performance Bonuses",
      description:
        "Monthly bonuses for top-rated guides and referral rewards for bringing new guides",
    },
  ];

  const companyValues = [
    {
      icon: <FaUsers />,
      title: "Local Guide Empowerment",
      description:
        "We empower local Vietnamese guides to share their culture and earn sustainable income through authentic tourism",
    },
    {
      icon: <FaHeart />,
      title: "Authentic Experiences",
      description:
        "Every tour showcases real Vietnamese culture, from street food adventures to traditional craft workshops",
    },
    {
      icon: <FaGlobe />,
      title: "Cultural Bridge",
      description:
        "Connecting international travelers with local communities for meaningful, respectful cultural exchange",
    },
    {
      icon: <FaRocket />,
      title: "Sustainable Tourism",
      description:
        "Supporting local economies while preserving Vietnam's cultural heritage and natural beauty for future generations",
    },
  ];

  const filteredJobs =
    selectedCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === selectedCategory);

  return (
    <div className="careers-page">
      {/* Modern Hero Section */}
      <section className="careers-hero-modern">
        <div className="hero-background-gradient">
          <div className="hero-particles"></div>
        </div>
        <div className="hero-content-modern">
          <div className="hero-text">
            <h1>Become a TourConnect Guide</h1>
            <p>
              Share your passion for Vietnamese culture while earning great
              income. Join our network of local guides and support staff who
              create unforgettable experiences for travelers.
            </p>
            <div className="hero-stats-modern">
              <div className="stat-modern">
                <h3>200+</h3>
                <p>Active Guides</p>
              </div>
              <div className="stat-modern">
                <h3>15+</h3>
                <p>Tour Types</p>
              </div>
              <div className="stat-modern">
                <h3>5000+</h3>
                <p>Happy Travelers</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Tour guide with travelers in Hoi An"
            />
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="values-section-modern">
        <div className="values-container">
          <div className="section-header">
            <h2>Why Become a Guide?</h2>
            <p>
              Join Vietnam's premier tour guide network and build a rewarding
              career
            </p>
          </div>
          <div className="values-grid">
            {companyValues.map((value, index) => (
              <div key={index} className="value-card-modern">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section-modern">
        <div className="benefits-container">
          <div className="section-header">
            <h2>Guide Benefits & Support</h2>
            <p>
              We take care of our guides so they can focus on creating amazing
              experiences
            </p>
          </div>
          <div className="benefits-grid-modern">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card-modern">
                {benefit.icon && (
                  <div className="benefit-icon">{benefit.icon}</div>
                )}
                <div className="benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="jobs-section-modern">
        <div className="jobs-container">
          <div className="section-header">
            <h2>Available Positions</h2>
            <p>
              Find your perfect role - from specialized tour guides to support
              positions
            </p>
          </div>

          <div className="job-filters-modern">
            {jobCategories.map((category) => (
              <button
                key={category}
                className={`filter-btn-modern ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="jobs-grid-modern">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card-modern">
                <div className="job-header-modern">
                  <div className="job-title-section">
                    <h3>{job.title}</h3>
                    <div className="job-salary">{job.salary}</div>
                  </div>
                  <div className="job-badges-modern">
                    <span className="job-type-badge">{job.type}</span>
                    <span className="job-level-badge">{job.level}</span>
                  </div>
                </div>

                <div className="job-meta-modern">
                  <span className="job-location">
                    <FaMapMarkerAlt /> {job.location}
                  </span>
                  <span className="job-posted">
                    <FaClock /> {job.posted}
                  </span>
                </div>

                <p className="job-description-modern">{job.description}</p>

                <div className="job-requirements-modern">
                  <h4>Key Requirements:</h4>
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <button className="apply-btn-modern">
                  Apply Now <FaArrowRight />
                </button>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="no-jobs-modern">
              <h3>No positions available in this category</h3>
              <p>Check back soon or browse other categories</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="careers-cta-modern">
        <div className="cta-content-modern">
          <div className="cta-text">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Don't see the perfect tour guide position? We're always looking
              for passionate locals who love sharing Vietnamese culture with the
              world.
            </p>
          </div>
          <div className="cta-buttons-modern">
            <button className="submit-resume-btn-modern">Submit Resume</button>
            <button className="contact-hr-btn-modern">Contact HR Team</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
