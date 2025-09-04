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
  FaUser,
  FaPlus,
  FaTimes,
  FaCheck,
  FaGlobe,
  FaAward,
  FaCamera,
} from "react-icons/fa";
import "./GuideProfileForm_new.css";

const GuideProfileForm = ({ onProfileCreated, initialData, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingCertificate, setUpdatingCertificate] = useState(false);

  // Helper function to parse JSON strings or arrays
  const parseArrayField = (field) => {
    console.log("parseArrayField input:", field, "type:", typeof field);
    if (!field) return [""];
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        console.log("JSON parsed successfully:", parsed);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
      } catch {
        console.log("JSON parse failed, returning as single item array:", [field]);
        return [field];
      }
    }
    console.log("Field is already array, returning:", field);
    return Array.isArray(field) && field.length > 0 ? field : [""];
  };

  const [formData, setFormData] = useState(() => {
    console.log("initialData:", initialData);
    console.log("initialData.certificate_img:", initialData?.certificate_img);
    
    return {
      location: initialData?.location || "",
      languages: parseArrayField(initialData?.languages),
      specialties: parseArrayField(initialData?.specialties),
      price_per_hour: initialData?.price_per_hour || 25,
      experience_years: initialData?.experience_years || 1,
      description: initialData?.description || "",
      certificates: parseArrayField(initialData?.certificates),
      certificate_img: parseArrayField(initialData?.certificate_img),
    };
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

  const handleUpdateCertificateImage = async () => {
    // Filter out empty URLs
    const validUrls = formData.certificate_img.filter(url => url.trim() !== "");
    
    console.log("formData.certificate_img:", formData.certificate_img);
    console.log("validUrls:", validUrls);
    
    if (validUrls.length === 0) {
      alert("Please enter at least one certificate image URL");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setUpdatingCertificate(true);
      setError(null);

      // Use the updateCertificateImage API with array of URLs
      console.log("Sending to API:", validUrls);
      await guidesService.updateCertificateImage(user.id, validUrls);
      
      alert("Certificate images updated successfully!");
    } catch (error) {
      console.error("Error updating certificate images:", error);
      setError(error.message || "Failed to update certificate images");
    } finally {
      setUpdatingCertificate(false);
    }
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

      if (initialData?.id || initialData?.guide_id) {
        // Update existing guide - use guide_id if available, otherwise use id
        const guideId = initialData.guide_id || initialData.id;
        response = await guidesService.updateGuideProfile(guideId, cleanedData);
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
          onProfileCreated(response);
        }
      } else {
        navigate("/guide/dashboard");
      }
    } catch (error) {
      setError(error.message || "Failed to create guide profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="guide-profile-form-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="guide-profile-form-container">
      {/* Modern Header */}
      <div className="profile-form-header">
        <div className="header-background">
          <div className="header-overlay"></div>
        </div>
        <div className="header-content">
          <div className="header-icon">
            <FaUser />
          </div>
          <h1 className="header-title">
            {initialData ? "Edit Your Profile" : "Complete Your Guide Profile"}
          </h1>
          <p className="header-subtitle">
            {initialData
              ? "Update your information to attract more travelers"
              : "Share your expertise and start connecting with travelers"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <div className="error-icon">
            <FaTimes />
          </div>
          <div className="error-content">
            <h4>Something went wrong</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Modern Form */}
      <div className="profile-form-wrapper">
        <form onSubmit={handleSubmit} className="modern-profile-form">
          {/* Progress Indicator */}
          <div className="form-progress">
            <div className="progress-steps">
              <div className="step active">
                <div className="step-icon">
                  <FaUser />
                </div>
                <span>Basic Info</span>
              </div>
              <div className="step active">
                <div className="step-icon">
                  <FaGlobe />
                </div>
                <span>Expertise</span>
              </div>
              <div className="step active">
                <div className="step-icon">
                  <FaAward />
                </div>
                <span>Experience</span>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div className="form-sections">
            {/* Basic Information Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="section-title">
                  <h3>Location & Languages</h3>
                  <p>Let travelers know where you operate</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-grid">
                  {/* Location */}
                  <div className="form-field full-width">
                    <label className="field-label">
                      <FaMapMarkerAlt className="label-icon" />
                      <span>Primary Location</span>
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Ho Chi Minh City, Vietnam"
                        className="modern-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="form-field full-width">
                    <label className="field-label">
                      <FaLanguage className="label-icon" />
                      <span>Languages You Speak</span>
                      <span className="required">*</span>
                    </label>
                    <div className="languages-grid">
                      {formData.languages.map((language, index) => (
                        <div key={index} className="language-input-group">
                          <div className="input-with-dropdown">
                            <select
                              value={language}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  e.target.value,
                                  "languages"
                                )
                              }
                              className="modern-select"
                            >
                              <option value="">Select Language</option>
                              {commonLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                  {lang}
                                </option>
                              ))}
                            </select>
                            {formData.languages.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeArrayItem(index, "languages")
                                }
                                className="remove-button"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("languages")}
                        className="add-button"
                      >
                        <FaPlus />
                        <span>Add Another Language</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <FaGlobe />
                </div>
                <div className="section-title">
                  <h3>Your Expertise</h3>
                  <p>What type of tours do you specialize in?</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-grid">
                  {/* Specialties */}
                  <div className="form-field full-width">
                    <label className="field-label">
                      <FaStar className="label-icon" />
                      <span>Tour Specialties</span>
                      <span className="required">*</span>
                    </label>
                    <div className="specialties-grid">
                      {formData.specialties.map((specialty, index) => (
                        <div key={index} className="specialty-input-group">
                          <div className="input-with-dropdown">
                            <select
                              value={specialty}
                              onChange={(e) =>
                                handleArrayChange(
                                  index,
                                  e.target.value,
                                  "specialties"
                                )
                              }
                              className="modern-select"
                            >
                              <option value="">Select Specialty</option>
                              {commonSpecialties.map((spec) => (
                                <option key={spec} value={spec}>
                                  {spec}
                                </option>
                              ))}
                            </select>
                            {formData.specialties.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeArrayItem(index, "specialties")
                                }
                                className="remove-button"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem("specialties")}
                        className="add-button"
                      >
                        <FaPlus />
                        <span>Add Another Specialty</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience & Pricing Section */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <FaAward />
                </div>
                <div className="section-title">
                  <h3>Experience & Pricing</h3>
                  <p>Share your background and set your rates</p>
                </div>
              </div>

              <div className="section-content">
                <div className="form-grid">
                  {/* Price per hour */}
                  <div className="form-field">
                    <label className="field-label">
                      <FaDollarSign className="label-icon" />
                      <span>Hourly Rate (USD)</span>
                      <span className="required">*</span>
                    </label>
                    <div className="price-input-wrapper">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        name="price_per_hour"
                        value={formData.price_per_hour}
                        onChange={handleInputChange}
                        min="10"
                        max="500"
                        step="5"
                        className="modern-input price-input"
                        required
                      />
                      <span className="price-suffix">per hour</span>
                    </div>
                    <small className="field-hint">
                      Competitive rates help attract more bookings
                    </small>
                  </div>

                  {/* Experience years */}
                  <div className="form-field">
                    <label className="field-label">
                      <FaCalendarAlt className="label-icon" />
                      <span>Years of Experience</span>
                      <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={handleInputChange}
                        min="0"
                        max="50"
                        className="modern-input"
                        required
                      />
                    </div>
                    <small className="field-hint">
                      Include related experience in tourism or hospitality
                    </small>
                  </div>
                </div>

                {/* Description */}
                <div className="form-field full-width">
                  <label className="field-label">
                    <FaFileAlt className="label-icon" />
                    <span>Tell Your Story</span>
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="5"
                      className="modern-textarea"
                      placeholder="Share your passion for guiding, unique experiences you offer, and what makes your tours special. This helps travelers connect with your story..."
                    />
                    <div className="textarea-counter">
                      {formData.description.length}/500
                    </div>
                  </div>
                  <small className="field-hint">
                    A compelling story helps travelers choose you over other
                    guides
                  </small>
                </div>

                {/* Certificates */}
                <div className="form-field full-width">
                  <label className="field-label">
                    <FaCertificate className="label-icon" />
                    <span>Certifications & Qualifications</span>
                    <span className="optional">(Optional)</span>
                  </label>
                  <div className="certificates-section">
                    {formData.certificates.map((certificate, index) => (
                      <div key={index} className="certificate-input-group">
                        <div className="input-wrapper">
                          <input
                            type="text"
                            value={certificate}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                e.target.value,
                                "certificates"
                              )
                            }
                            placeholder="e.g., Tourism Board License, First Aid Certification"
                            className="modern-input"
                          />
                          {formData.certificates.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem(index, "certificates")
                              }
                              className="input-remove-btn"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("certificates")}
                      className="add-button secondary"
                    >
                      <FaPlus />
                      <span>Add Certification</span>
                    </button>
                  </div>
                  <small className="field-hint">
                    Certifications build trust and credibility with travelers
                  </small>
                </div>

                {/* Certificate Image URLs */}
                <div className="form-field full-width">
                  <label className="field-label">
                    <FaCamera className="label-icon" />
                    <span>Certificate Image URLs</span>
                    <span className="optional">(Optional)</span>
                  </label>
                  <div className="certificate-images-section">
                    {formData.certificate_img.map((imageUrl, index) => (
                      <div key={index} className="certificate-image-input-group">
                        <div className="input-wrapper">
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) =>
                              handleArrayChange(
                                index,
                                e.target.value,
                                "certificate_img"
                              )
                            }
                            placeholder="https://example.com/your-certificate-image.jpg"
                            className="modern-input"
                          />
                          {formData.certificate_img.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem(index, "certificate_img")
                              }
                              className="input-remove-btn"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("certificate_img")}
                      className="add-button secondary"
                    >
                      <FaPlus />
                      <span>Add Another Certificate Image</span>
                    </button>
                    <div className="update-section">
                      <button
                        type="button"
                        onClick={handleUpdateCertificateImage}
                        className="update-certificate-btn"
                        disabled={updatingCertificate || formData.certificate_img.every(url => !url.trim())}
                      >
                        {updatingCertificate ? (
                          <>
                            <div className="button-spinner"></div>
                            Update All Images
                          </>
                        ) : (
                          <>
                            <FaCamera />
                            Update All Images
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <small className="field-hint">
                    Add URLs of your certificate images to build credibility with travelers
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <div className="actions-content">
              <button
                type="button"
                onClick={() => (onCancel ? onCancel() : navigate("/"))}
                className="action-button secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="action-button primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    {initialData ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FaCheck />
                    {initialData ? "Update Profile" : "Create Profile"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideProfileForm;
