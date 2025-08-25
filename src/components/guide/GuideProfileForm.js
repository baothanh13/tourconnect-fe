import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import {
  FaMapMarkerAlt,
  FaLanguage,
  FaStar,
  FaDollarSign,
  FaCalendarAlt,
  FaFileAlt,
  FaCertificate,
} from "react-icons/fa";
import "./GuideProfileForm.css";

const GuideProfileForm = ({ onProfileCreated, initialData, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to parse JSON strings or arrays
  const parseArrayField = (field) => {
    if (!field) return [""];
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
      } catch {
        return [field];
      }
    }
    return Array.isArray(field) && field.length > 0 ? field : [""];
  };

  const [formData, setFormData] = useState({
    location: initialData?.location || "",
    languages: parseArrayField(initialData?.languages),
    specialties: parseArrayField(initialData?.specialties),
    price_per_hour: initialData?.price_per_hour || 25,
    experience_years: initialData?.experience_years || 1,
    description: initialData?.description || "",
    certificates: parseArrayField(initialData?.certificates),
  });

  const commonLanguages = [
    "English",
    "Vietnamese",
    "Chinese",
    "Japanese",
    "Korean",
    "French",
    "German",
    "Spanish",
    "Thai",
    "Indonesian",
  ];

  const commonSpecialties = [
    "Cultural Tours",
    "Food Tours",
    "Historical Tours",
    "Adventure Tours",
    "Photography Tours",
    "Shopping Tours",
    "Nature Tours",
    "City Tours",
    "Religious Tours",
    "Art Tours",
    "Architecture Tours",
    "Night Tours",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (index, value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Filter out empty strings from arrays
      const cleanedData = {
        user_id: user.id,
        location: formData.location.trim(),
        languages: formData.languages.filter((lang) => lang.trim() !== ""),
        specialties: formData.specialties.filter((spec) => spec.trim() !== ""),
        price_per_hour: parseFloat(formData.price_per_hour),
        experience_years: parseInt(formData.experience_years),
        description: formData.description.trim(),
        certificates: formData.certificates.filter(
          (cert) => cert.trim() !== ""
        ),
      };

      // Validate required fields
      if (
        !cleanedData.location ||
        cleanedData.languages.length === 0 ||
        cleanedData.specialties.length === 0
      ) {
        throw new Error("Please fill in all required fields");
      }

      let response;

      if (initialData?.guide_id) {
        // Update existing guide
        response = await guidesService.updateGuideProfile(
          initialData.guide_id,
          cleanedData
        );
        alert("Guide profile updated successfully!");
      } else {
        // Create new guide
        response = await guidesService.createGuide(cleanedData);
        alert("Guide profile created successfully!");
      }

      if (onProfileCreated) {
        // Fetch fresh data after update to ensure we have the latest
        try {
          const freshData = await guidesService.getGuideByUserId(user.id);
          onProfileCreated(freshData);
        } catch (fetchError) {
          console.error("Error fetching fresh profile data:", fetchError);
          onProfileCreated(response);
        }
      } else {
        navigate("/guide/dashboard");
      }
    } catch (error) {
      console.error("Error saving guide profile:", error);
      setError(error.message || "Failed to create guide profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="guide-profile-form">
      <div className="form-header">
        <h2>
          {initialData
            ? "Edit Your Guide Profile"
            : "Create Your Guide Profile"}
        </h2>
        <p>Complete your profile to start offering tours</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">
            <FaMapMarkerAlt /> Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Hanoi, Vietnam"
            required
          />
        </div>

        {/* Languages */}
        <div className="form-group">
          <label>
            <FaLanguage /> Languages Spoken *
          </label>
          {formData.languages.map((language, index) => (
            <div key={index} className="array-input">
              <select
                value={language}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "languages")
                }
              >
                <option value="">Select a language</option>
                {commonLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {formData.languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "languages")}
                  className="remove-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("languages")}
            className="add-btn"
          >
            + Add Language
          </button>
        </div>

        {/* Specialties */}
        <div className="form-group">
          <label>
            <FaStar /> Tour Specialties *
          </label>
          {formData.specialties.map((specialty, index) => (
            <div key={index} className="array-input">
              <select
                value={specialty}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "specialties")
                }
              >
                <option value="">Select a specialty</option>
                {commonSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {formData.specialties.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "specialties")}
                  className="remove-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("specialties")}
            className="add-btn"
          >
            + Add Specialty
          </button>
        </div>

        {/* Price per hour */}
        <div className="form-group">
          <label htmlFor="price_per_hour">
            <FaDollarSign /> Price per Hour (USD) *
          </label>
          <input
            type="number"
            id="price_per_hour"
            name="price_per_hour"
            value={formData.price_per_hour}
            onChange={handleInputChange}
            min="5"
            max="500"
            step="5"
            required
          />
        </div>

        {/* Experience years */}
        <div className="form-group">
          <label htmlFor="experience_years">
            <FaCalendarAlt /> Years of Experience *
          </label>
          <input
            type="number"
            id="experience_years"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleInputChange}
            min="0"
            max="50"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">
            <FaFileAlt /> About You
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Tell tourists about yourself, your experience, and what makes your tours special..."
          />
        </div>

        {/* Certificates */}
        <div className="form-group">
          <label>
            <FaCertificate /> Certificates (Optional)
          </label>
          {formData.certificates.map((certificate, index) => (
            <div key={index} className="array-input">
              <input
                type="text"
                value={certificate}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "certificates")
                }
                placeholder="e.g., Tour Guide License, First Aid Certificate"
              />
              {formData.certificates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "certificates")}
                  className="remove-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("certificates")}
            className="add-btn"
          >
            + Add Certificate
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? initialData
                ? "Updating Profile..."
                : "Creating Profile..."
              : initialData
              ? "Update Guide Profile"
              : "Create Guide Profile"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => (onCancel ? onCancel() : navigate("/"))}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuideProfileForm;
