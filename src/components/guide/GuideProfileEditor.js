import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import {
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaLanguage,
  FaStar,
  FaDollarSign,
  FaCalendarAlt,
  FaFileAlt,
  FaCertificate,
} from "react-icons/fa";
import "./GuideProfileForm.css";

const GuideProfileEditor = ({
  guideId,
  userId,
  mode = "create",
  onSave,
  onCancel,
  initialData = null,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    location: "",
    languages: [""],
    specialties: [""],
    price_per_hour: 25,
    experience_years: 1,
    description: "",
    certificates: [""],
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

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        let data = initialData;

        if (!data) {
          if (mode === "edit" && guideId) {
            // GET /api/guides/{id} - Get guide profile by ID
            data = await guidesService.getGuideById(guideId);
          } else if (userId) {
            // GET /api/guides/user/{userId} - Get guide profile by user ID
            try {
              data = await guidesService.getGuideByUserId(userId);
            } catch (error) {
              if (error.message.includes("not found")) {
                // Profile doesn't exist, keep default form data for creation
                data = null;
              } else {
                throw error;
              }
            }
          }
        }

        if (data) {
          setFormData({
            location: data.location || "",
            languages: Array.isArray(data.languages)
              ? data.languages
              : data.languages
              ? [data.languages]
              : [""],
            specialties: Array.isArray(data.specialties)
              ? data.specialties
              : data.specialties
              ? [data.specialties]
              : [""],
            price_per_hour: data.price_per_hour || 25,
            experience_years: data.experience_years || 1,
            description: data.description || "",
            certificates: Array.isArray(data.certificates)
              ? data.certificates
              : data.certificates
              ? [data.certificates]
              : [""],
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [guideId, userId, mode, initialData]);

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

    try {
      setSaving(true);
      setError(null);

      // Filter out empty strings from arrays
      const cleanedData = {
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

      if (mode === "create") {
        // POST /api/guides - Create a new guide profile
        const createData = {
          user_id: userId || user?.id,
          ...cleanedData,
        };
        response = await guidesService.createGuide(createData);
        alert("Guide profile created successfully!");
      } else if (mode === "createProfile") {
        // POST /api/guides/profile - Create guide profile for existing user
        const profileData = {
          userId: userId || user?.id,
          ...cleanedData,
        };
        response = await guidesService.createGuideProfile(profileData);
        alert("Guide profile created successfully!");
      } else if (mode === "edit" && guideId) {
        // PUT /api/guides/{id} - Update guide profile by ID
        response = await guidesService.updateGuide(guideId, cleanedData);
        alert("Guide profile updated successfully!");
      }

      if (onSave) {
        onSave(response);
      } else {
        navigate("/guide/dashboard");
      }
    } catch (error) {
      setError(error.message || "Failed to save guide profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="guide-profile-form">
      <div className="form-header">
        <h2>
          {mode === "create" || mode === "createProfile"
            ? "Create Guide Profile"
            : "Edit Guide Profile"}
        </h2>
        <p>
          {mode === "create" || mode === "createProfile"
            ? "Complete your profile to start offering tours"
            : "Update your guide profile information"}
        </p>
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
          <button type="submit" className="submit-btn" disabled={saving}>
            <FaSave />
            {saving
              ? "Saving..."
              : mode === "edit"
              ? "Update Profile"
              : "Create Profile"}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuideProfileEditor;
