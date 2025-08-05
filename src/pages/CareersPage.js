import React, { useState } from "react";
import "./CareersPage.css";

const CareersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const jobCategories = [
    "All",
    "Engineering",
    "Design",
    "Marketing",
    "Operations",
    "Customer Support",
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      category: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      level: "Senior",
      description:
        "Join our engineering team to build the next generation of travel experiences. Work with React, Node.js, and modern web technologies.",
      requirements: [
        "5+ years React experience",
        "TypeScript proficiency",
        "Experience with modern build tools",
        "Strong problem-solving skills",
      ],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "UX/UI Designer",
      category: "Design",
      location: "New York / Remote",
      type: "Full-time",
      level: "Mid-level",
      description:
        "Create beautiful and intuitive user experiences for millions of travelers worldwide. Design the future of travel technology.",
      requirements: [
        "3+ years UI/UX experience",
        "Proficiency in Figma/Sketch",
        "User research experience",
        "Mobile-first design thinking",
      ],
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Digital Marketing Manager",
      category: "Marketing",
      location: "London / Hybrid",
      type: "Full-time",
      level: "Mid-level",
      description:
        "Lead our digital marketing efforts across multiple channels. Drive growth and engagement for our global travel platform.",
      requirements: [
        "Digital marketing experience",
        "SEO/SEM expertise",
        "Analytics proficiency",
        "Content strategy experience",
      ],
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Customer Success Manager",
      category: "Customer Support",
      location: "Remote",
      type: "Full-time",
      level: "Mid-level",
      description:
        "Help our guides and travelers have amazing experiences. Be the voice of our customers and drive product improvements.",
      requirements: [
        "Customer service experience",
        "Problem-solving skills",
        "Communication excellence",
        "Travel industry knowledge preferred",
      ],
      posted: "5 days ago",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      category: "Engineering",
      location: "Remote / Berlin",
      type: "Full-time",
      level: "Senior",
      description:
        "Build and maintain our infrastructure to support millions of users. Work with cloud technologies and automation.",
      requirements: [
        "AWS/Azure experience",
        "Docker/Kubernetes",
        "CI/CD pipelines",
        "Infrastructure as Code",
      ],
      posted: "1 week ago",
    },
    {
      id: 6,
      title: "Operations Coordinator",
      category: "Operations",
      location: "Tokyo / On-site",
      type: "Full-time",
      level: "Entry-level",
      description:
        "Support our operations team in ensuring smooth day-to-day business operations across the Asia-Pacific region.",
      requirements: [
        "Strong organizational skills",
        "Attention to detail",
        "Cross-cultural communication",
        "Japanese language preferred",
      ],
      posted: "4 days ago",
    },
  ];

  const benefits = [
    {
      icon: "🏥",
      title: "Health Insurance",
      description: "Comprehensive medical, dental, and vision coverage",
    },
    {
      icon: "🌴",
      title: "Unlimited PTO",
      description: "Take the time you need to recharge and explore",
    },
    {
      icon: "💰",
      title: "Competitive Salary",
      description: "Industry-leading compensation packages",
    },
    {
      icon: "📈",
      title: "Stock Options",
      description: "Equity participation in our growing company",
    },
    {
      icon: "🌍",
      title: "Travel Allowance",
      description: "$2000 annual travel credit to explore the world",
    },
    {
      icon: "💻",
      title: "Remote Work",
      description: "Flexible work arrangements and home office setup",
    },
    {
      icon: "📚",
      title: "Learning Budget",
      description: "$1500 annual budget for courses and conferences",
    },
    {
      icon: "🎉",
      title: "Team Events",
      description: "Regular team building and company retreats",
    },
  ];

  const filteredJobs =
    selectedCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === selectedCategory);

  return (
    <div className="careers-page">
      {/* Hero Section */}
      <div className="careers-hero">
        <div className="careers-hero-content">
          <h1>Join Our Journey</h1>
          <p>
            Help us revolutionize travel by connecting people with amazing local
            experiences
          </p>
          <div className="hero-stats">
            <div className="stat">
              <h3>50+</h3>
              <p>Team Members</p>
            </div>
            <div className="stat">
              <h3>15+</h3>
              <p>Countries</p>
            </div>
            <div className="stat">
              <h3>100k+</h3>
              <p>Happy Travelers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Culture */}
      <div className="culture-section">
        <div className="culture-container">
          <h2>Our Culture & Values</h2>
          <div className="culture-grid">
            <div className="culture-card">
              <div className="culture-icon">🚀</div>
              <h3>Innovation First</h3>
              <p>
                We're constantly pushing boundaries to create better travel
                experiences
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>
                We believe the best ideas come from diverse teams working
                together
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">🌟</div>
              <h3>Excellence</h3>
              <p>
                We strive for quality in everything we do, from code to customer
                service
              </p>
            </div>
            <div className="culture-card">
              <div className="culture-icon">🌱</div>
              <h3>Growth Mindset</h3>
              <p>We support continuous learning and personal development</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="benefits-section">
        <div className="benefits-container">
          <h2>Why Work With Us?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="jobs-section">
        <div className="jobs-container">
          <h2>Open Positions</h2>

          <div className="job-filters">
            {jobCategories.map((category) => (
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

          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <div className="job-badges">
                    <span className="job-type">{job.type}</span>
                    <span className="job-level">{job.level}</span>
                  </div>
                </div>

                <div className="job-meta">
                  <span className="job-location">📍 {job.location}</span>
                  <span className="job-posted">🕒 {job.posted}</span>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <button className="apply-btn">Apply Now</button>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="no-jobs">
              <h3>No positions available in this category</h3>
              <p>Check back soon or browse other categories</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="careers-cta">
        <div className="cta-content">
          <h2>Don't See Your Role?</h2>
          <p>
            We're always looking for talented people to join our team. Send us
            your resume and let us know how you can contribute to our mission.
          </p>
          <div className="cta-buttons">
            <button className="submit-resume-btn">Submit Resume</button>
            <button className="contact-hr-btn">Contact HR Team</button>
          </div>
        </div>
      </div>

      {/* Life at Company */}
      <div className="life-section">
        <div className="life-container">
          <h2>Life at TourConnect</h2>
          <div className="life-gallery">
            <div className="life-item">
              <div className="life-image">🏢</div>
              <h3>Modern Offices</h3>
              <p>Beautiful workspaces in major cities around the world</p>
            </div>
            <div className="life-item">
              <div className="life-image">🎯</div>
              <h3>Team Building</h3>
              <p>
                Regular team events and company retreats to build connections
              </p>
            </div>
            <div className="life-item">
              <div className="life-image">🌟</div>
              <h3>Recognition</h3>
              <p>We celebrate achievements and milestones together</p>
            </div>
            <div className="life-item">
              <div className="life-image">⚖️</div>
              <h3>Work-Life Balance</h3>
              <p>Flexible schedules and remote work options</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
