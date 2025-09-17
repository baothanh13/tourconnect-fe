import React, { useState } from "react";
import "./BlogPage.css";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Hidden Gems in Southeast Asia",
      excerpt:
        "Discover breathtaking destinations that most tourists never see. From secret beaches to ancient temples, uncover the beauty that awaits off the beaten path.",
      author: "Sarah Chen",
      date: "2025-07-25",
      image:
        "https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Destinations",
      readTime: "5 min read",
      tags: ["Adventure", "Southeast Asia", "Hidden Gems"],
      featured: false,
    },
    {
      id: 2,
      title: "How to Choose the Perfect Local Guide",
      excerpt:
        "Learn the essential tips for selecting a guide who will make your travel experience unforgettable. From language skills to local knowledge, here's what matters most.",
      author: "Michael Rodriguez",
      date: "2025-07-20",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Travel Tips",
      readTime: "3 min read",
      tags: ["Guides", "Travel Tips", "Local Experience"],
      featured: false,
    },
    {
      id: 3,
      title: "Sustainable Tourism: Travel Responsibly",
      excerpt:
        "Explore how you can minimize your environmental impact while maximizing your cultural experience. Discover eco-friendly practices that benefit local communities.",
      author: "Emma Thompson",
      date: "2025-07-15",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Sustainability",
      readTime: "7 min read",
      tags: ["Eco Travel", "Sustainability", "Responsible Tourism"],
      featured: true,
    },
    {
      id: 4,
      title: "Food Adventures: Street Food Guide",
      excerpt:
        "A comprehensive guide to the best street food experiences around the world, from Bangkok's floating markets to Mexico City's vibrant food scene.",
      author: "David Kim",
      date: "2025-07-10",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Food & Culture",
      readTime: "6 min read",
      tags: ["Street Food", "Culture", "Culinary Travel"],
      featured: false,
    },
    {
      id: 5,
      title: "Photography Tips for Your Next Adventure",
      excerpt:
        "Capture stunning travel photos with these professional tips from award-winning travel photographers. Learn composition, lighting, and storytelling techniques.",
      author: "Lisa Anderson",
      date: "2025-07-05",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Photography",
      readTime: "4 min read",
      tags: ["Photography", "Travel Tips", "Visual Storytelling"],
      featured: false,
    },
    {
      id: 6,
      title: "Budget Travel: Maximum Experience, Minimum Cost",
      excerpt:
        "Discover how to travel more while spending less with these insider secrets and money-saving strategies from seasoned budget travelers.",
      author: "James Wilson",
      date: "2025-07-01",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Budget Travel",
      readTime: "8 min read",
      tags: ["Budget Travel", "Money Saving", "Travel Hacks"],
      featured: false,
    },
    {
      id: 7,
      title: "Cultural Immersion: Beyond Tourist Attractions",
      excerpt:
        "Learn how to connect with local communities and experience authentic culture during your travels. Discover meaningful ways to engage with traditions.",
      author: "Maria Santos",
      date: "2025-06-28",
      image:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Food & Culture",
      readTime: "6 min read",
      tags: ["Culture", "Local Experience", "Authentic Travel"],
      featured: false,
    },
    {
      id: 8,
      title: "Solo Travel Safety: Complete Guide",
      excerpt:
        "Essential safety tips and strategies for solo travelers. From research to emergency preparedness, stay safe while exploring independently.",
      author: "Alex Johnson",
      date: "2025-06-25",
      image:
        "https://images.unsplash.com/photo-1509923936403-148b60b94328?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Travel Tips",
      readTime: "10 min read",
      tags: ["Solo Travel", "Safety", "Travel Planning"],
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Destinations",
    "Travel Tips",
    "Sustainability",
    "Food & Culture",
    "Photography",
    "Budget Travel",
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0];
  const regularPosts = filteredPosts.filter(
    (post) => post.id !== featuredPost.id
  );

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>TourConnect Blog</h1>
          <p>
            Discover amazing stories, travel tips, and insider guides from our
            community of explorers
          </p>
          <div className="hero-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search articles, destinations, tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="blog-container">
        {/* Categories Filter */}
        <section className="categories-section">
          <div className="categories-container">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-pill ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Article */}
        {activeCategory === "All" && (
          <section className="featured-section">
            <div className="section-header">
              <h2>Featured Article</h2>
              <div className="section-line"></div>
            </div>
            <article className="featured-article">
              <div className="featured-image">
                <img src={featuredPost.image} alt={featuredPost.title} />
                <div className="featured-badge">Featured</div>
                <div className="featured-overlay">
                  <div className="featured-category">
                    {featuredPost.category}
                  </div>
                </div>
              </div>
              <div className="featured-content">
                <div className="featured-meta">
                  <span className="author">By {featuredPost.author}</span>
                  <span className="divider">•</span>
                  <span className="date">
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="divider">•</span>
                  <span className="read-time">{featuredPost.readTime}</span>
                </div>
                <h3>{featuredPost.title}</h3>
                <p>{featuredPost.excerpt}</p>
                <div className="featured-tags">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="read-more-btn">
                  Read Full Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </article>
          </section>
        )}

        {/* Blog Articles Grid */}
        <section className="articles-section">
          <div className="section-header">
            <h2>
              {activeCategory === "All"
                ? "Latest Articles"
                : `${activeCategory} Articles`}
              <span className="articles-count">({regularPosts.length})</span>
            </h2>
            <div className="section-line"></div>
          </div>

          {regularPosts.length > 0 ? (
            <div className="articles-grid">
              {regularPosts.map((post) => (
                <article key={post.id} className="article-card">
                  <div className="card-image">
                    <img src={post.image} alt={post.title} />
                    <div className="card-category">{post.category}</div>
                  </div>
                  <div className="card-content">
                    <div className="card-meta">
                      <span className="author">By {post.author}</span>
                      <span className="divider">•</span>
                      <span className="date">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="card-tags">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="card-footer">
                      <span className="read-time">{post.readTime}</span>
                      <button className="read-more">
                        Read More
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📝</div>
              <h3>No articles found</h3>
              <p>Try adjusting your search or browse different categories</p>
            </div>
          )}
        </section>

        {/* Load More / Pagination */}
        {regularPosts.length > 0 && (
          <div className="load-more-section">
            <button className="load-more-btn">Load More Articles</button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <div className="newsletter-icon">✈️</div>
            <h2>Stay Updated with TourConnect</h2>
            <p>
              Get the latest travel insights, destination guides, and exclusive
              tips delivered directly to your inbox
            </p>
            <form className="newsletter-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">
                  Subscribe Now
                </button>
              </div>
              <p className="newsletter-disclaimer">
                Join 10,000+ travelers. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
