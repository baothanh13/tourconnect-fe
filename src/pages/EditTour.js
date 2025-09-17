import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toursService } from "../services/toursService";
import {
  FaArrowLeft,
  FaSave,
  FaImage,
  FaDollarSign,
  FaClock,
  FaUsers,
  FaList,
  FaFileAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import Loading from "../components/Loading";
import "./CreateTour.css";

const EditTour = () => {
  const navigate = useNavigate();
  const { tourId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_hours: 2,
    max_people: 10,
    price: 25.0,
    image_url: "",
    category: "cultural",
    tour_date: "",
    tour_time: "",
  });

  const categories = [
    "cultural",
    "adventure",
    "food",
    "historical",
    "nature",
    "shopping",
    "nightlife",
    "art",
    "religious",
    "educational",
  ];

  const loadTour = async () => {
    try {
      setLoading(true);
      const tourData = await toursService.getTourById(tourId);
      setFormData({
        title: tourData.title || "",
        description: tourData.description || "",
        duration_hours: tourData.duration_hours || 2,
        max_people: tourData.max_people || 10,
        price: tourData.price || 25.0,
        image_url: tourData.image_url || "",
        category: tourData.category || "cultural",
        tour_date: tourData.tour_date || "",
        tour_time: tourData.tour_time ? tourData.tour_time.substring(0, 5) : "",
      });
    } catch (error) {
      setError("Failed to load tour details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTour();
  }, [tourId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (formData.price <= 0) return "Price must be greater than 0";
    if (formData.duration_hours <= 0) return "Duration must be greater than 0";
    if (formData.max_people <= 0)
      return "Max participants must be greater than 0";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await toursService.updateTour(tourId, formData);
      navigate("/guide/tours");
    } catch (error) {
      setError(error.message || "Failed to update tour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="create-tour-container">
      <div className="create-tour-header">
        {/* <button className="back-btn" onClick={() => navigate("/guide/tours")}>
          <FaArrowLeft /> Back to Tours
        </button> */}
        <h1>Edit Tour</h1>
        <p>Update your tour details and offerings</p>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-tour-form">
        <div className="form-section">
          <h3>
            <FaFileAlt /> Basic Information
          </h3>

          <div className="form-group">
            <label htmlFor="title">Tour Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Hanoi Old Quarter Walking Tour"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your tour experience, what visitors will see and do..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>
            <FaImage /> Media
          </h3>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/tour-image.jpg"
            />
            {formData.image_url && (
              <div className="image-preview">
                <img
                  src={formData.image_url}
                  alt="Tour preview"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>
            <FaList /> Tour Details
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration_hours">
                <FaClock /> Duration (hours) *
              </label>
              <input
                type="number"
                id="duration_hours"
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleInputChange}
                min="0.5"
                step="0.5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="max_people">
                <FaUsers /> Max Participants *
              </label>
              <input
                type="number"
                id="max_people"
                name="max_people"
                value={formData.max_people}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">
              <FaDollarSign /> Price per Person (USD) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tour_date">
                <FaCalendarAlt /> Tour Date
              </label>
              <input
                type="date"
                id="tour_date"
                name="tour_date"
                value={formData.tour_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tour_time">
                <FaClock /> Tour Time
              </label>
              <input
                type="time"
                id="tour_time"
                name="tour_time"
                value={formData.tour_time}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/guide/tours")}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <>Updating...</>
            ) : (
              <>
                <FaSave /> Update Tour
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTour;
