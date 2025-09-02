import React from "react";
import "./BlogPage.css";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Hidden Gems in Southeast Asia",
      excerpt:
        "Discover breathtaking destinations that most tourists never see. From secret beaches to ancient temples...",
      author: "Sarah Chen",
      date: "2025-07-25",
      image: "🏝️",
      category: "Destinations",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "How to Choose the Perfect Local Guide",
      excerpt:
        "Learn the essential tips for selecting a guide who will make your travel experience unforgettable...",
      author: "Michael Rodriguez",
      date: "2025-07-20",
      image: "🗺️",
      category: "Travel Tips",
      readTime: "3 min read",
    },
    {
      id: 3,
      title: "Sustainable Tourism: Travel Responsibly",
      excerpt:
        "Explore how you can minimize your environmental impact while maximizing your cultural experience...",
      author: "Emma Thompson",
      date: "2025-07-15",
      image: "🌱",
      category: "Sustainability",
      readTime: "7 min read",
    },
    {
      id: 4,
      title: "Food Adventures: Street Food Guide",
      excerpt:
        "A comprehensive guide to the best street food experiences around the world, from Bangkok to Mexico City...",
      author: "David Kim",
      date: "2025-07-10",
      image: "🍜",
      category: "Food & Culture",
      readTime: "6 min read",
    },
    {
      id: 5,
      title: "Photography Tips for Your Next Adventure",
      excerpt:
        "Capture stunning travel photos with these professional tips from award-winning travel photographers...",
      author: "Lisa Anderson",
      date: "2025-07-05",
      image: "📸",
      category: "Photography",
      readTime: "4 min read",
    },
    {
      id: 6,
      title: "Budget Travel: Maximum Experience, Minimum Cost",
      excerpt:
        "Discover how to travel more while spending less with these insider secrets and money-saving strategies...",
      author: "James Wilson",
      date: "2025-07-01",
      image: "💰",
      category: "Budget Travel",
      readTime: "8 min read",
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

  return (
    <div className="blog-page">
      <div className="blog-hero"></div>

      <div className="blog-container">
        <div className="blog-filters">
          <h3>Categories</h3>
          <div className="category-buttons">
            {categories.map((category) => (
              <button key={category} className="category-btn active">
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-content">
          <div className="featured-post">
            <div className="featured-badge">Featured</div>
            <div className="featured-image">🏔️</div>
            <div className="featured-text">
              <span className="featured-category">Adventure</span>
              <h2>
                Epic Mountain Adventures: Conquering the World's Highest Peaks
              </h2>
              <p>
                Join us on an incredible journey through the world's most
                spectacular mountain ranges. From the Himalayas to the Andes,
                discover what it takes to reach new heights and the rewards that
                await those brave enough to try.
              </p>
              <div className="featured-meta">
                <span>By Alex Turner</span>
                <span>•</span>
                <span>July 30, 2025</span>
                <span>•</span>
                <span>10 min read</span>
              </div>
            </div>
          </div>

          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <span className="blog-emoji">{post.image}</span>
                  <div className="blog-category">{post.category}</div>
                </div>
                <div className="blog-card-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="author">By {post.author}</span>
                    <span className="date">{post.date}</span>
                    <span className="read-time">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="blog-pagination">
            <button className="pagination-btn">← Previous</button>
            <span className="pagination-info">Page 1 of 5</span>
            <button className="pagination-btn">Next →</button>
          </div>
        </div>
      </div>

      <div className="blog-newsletter">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>
            Get the latest travel tips and destination guides delivered to your
            inbox
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
