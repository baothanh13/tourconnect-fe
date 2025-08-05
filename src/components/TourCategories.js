import React from "react";
import { useNavigate } from "react-router-dom";
import "./TourCategories.css";

const TourCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "cultural",
      title: "Cultural Tours",
      description: "Explore history and heritage",
      icon: "🏛️",
      count: "25+ tours",
      tours: 25,
    },
    {
      id: "food",
      title: "Food Tours",
      description: "Taste local cuisine",
      icon: "🍽️",
      count: "18+ tours",
      tours: 18,
    },
    {
      id: "adventure",
      title: "Adventure Tours",
      description: "Thrilling experiences",
      icon: "🏔️",
      count: "32+ tours",
      tours: 32,
    },
    {
      id: "city",
      title: "City Tours",
      description: "Urban exploration",
      icon: "🏙️",
      count: "42+ tours",
      tours: 42,
    },
    {
      id: "nature",
      title: "Nature Tours",
      description: "Connect with nature",
      icon: "🌿",
      count: "28+ tours",
      tours: 28,
    },
    {
      id: "photography",
      title: "Photography Tours",
      description: "Capture memories",
      icon: "📸",
      count: "15+ tours",
      tours: 15,
    },
  ];

  const handleCategoryClick = (category) => {
    // Navigate to guides page with category filter
    navigate(
      `/guides?category=${encodeURIComponent(
        category.title
      )}&search=${encodeURIComponent(category.title)}`
    );
  };

  return (
    <div className="tour-categories">
      <div className="categories-container">
        {/* Header Section */}
        <div className="categories-header">
          <h2>Explore by Category</h2>
          <p>
            Discover amazing experiences tailored to your interests. Choose from
            our curated collection of tour categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          <div className="categories-list">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-item"
                onClick={() => handleCategoryClick(category)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCategoryClick(category);
                  }
                }}
              >
                <div className="category-header">
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-title">{category.title}</h3>
                </div>

                <p className="category-description">{category.description}</p>

                <div className="category-stats">
                  <span className="category-count">{category.count}</span>
                  <div className="category-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCategories;
