import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { guidesService } from "../../services/guidesService";
import GuideProfileForm from "./GuideProfileForm";
import Loading from "../Loading";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLanguage,
  FaCalendarAlt,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaStar,
  FaGraduationCap,
  FaEdit,
  FaCamera,
  FaGlobe,
  FaAward,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";
import "./GuideProfile_new.css";

const GuideProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.id) {
        const profileData = await guidesService.getGuideByUserId(user.id);
        setProfile(profileData);
      }
    } catch (error) {
      // If guide not found (404), it means no profile exists - this is normal for new guides
      if (
        error.message?.includes("Guide not found") ||
        error.message?.includes("404")
      ) {
        setProfile(null); // This will trigger the create form
        setError(null); // Clear error since this is expected
      } else {
        setError("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData, editing]); // Add editing as dependency to refetch when editing mode changes

  const getVerificationIcon = (status) => {
    switch (status) {
      case "verified":
        return <FaCheckCircle className="status-icon verified" />;
      case "pending":
        return <FaClock className="status-icon pending" />;
      case "rejected":
        return <FaTimes className="status-icon rejected" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const formatLanguages = (languages) => {
    if (!languages) return "Not specified";
    if (typeof languages === "string") {
      try {
        const parsed = JSON.parse(languages);
        return Array.isArray(parsed) ? parsed.join(", ") : languages;
      } catch {
        return languages;
      }
    }
    return Array.isArray(languages) ? languages.join(", ") : "Not specified";
  };

  const formatSpecialties = (specialties) => {
    if (!specialties) return "Not specified";
    if (typeof specialties === "string") {
      try {
        const parsed = JSON.parse(specialties);
        return Array.isArray(parsed) ? parsed.join(", ") : specialties;
      } catch {
        return specialties;
      }
    }
    return Array.isArray(specialties)
      ? specialties.join(", ")
      : "Not specified";
  };

  const formatRating = (rating) => {
    if (rating === null || rating === undefined) return "0.0";
    const numRating = typeof rating === "number" ? rating : parseFloat(rating);
    return isNaN(numRating) ? "0.0" : numRating.toFixed(1);
  };

  const handleAvatarUpload = async (event) => {
    console.log("handleAvatarUpload called", event);
    const file = event.target.files[0];
    console.log("Selected file:", file);

    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    console.log("Starting upload...");
    setUploadingAvatar(true);

    try {
      // ✅ Gọi API upload avatar bằng FormData
      const response = await guidesService.uploadUserAvatar(user.id, file);

      // Cập nhật local profile state với URL trả về từ backend
      setProfile((prev) => ({
        ...prev,
        avatar_url: response.data.user.avatar_url, // backend trả full URL
      }));

      alert("Profile photo updated successfully!");
      console.log("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload profile photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="guide-profile-error">
        <div className="error-container">
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setProfile(null); // This will show the create form
            }}
            className="retry-btn"
          >
            Create Profile Instead
          </button>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
            style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <GuideProfileForm
        onProfileCreated={async (newProfile) => {
          // Extract the guide object from response
          const profileData = newProfile.guide || newProfile;
          setProfile(profileData);
          // Force a fresh fetch to ensure consistency
          await fetchProfileData();
        }}
      />
    );
  }

  if (editing) {
    return (
      <GuideProfileForm
        initialData={profile}
        onProfileCreated={async (updatedProfile) => {
          setEditing(false);

          // Force a fresh fetch from server to ensure we have the latest data
          await fetchProfileData();

          // Clear any cached data and refetch again
          setTimeout(async () => {
            await fetchProfileData();
          }, 100);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="modern-guide-profile-container">
      {/* Back Button */}
      <div className="profile-back-button">
        <button
          onClick={() => navigate("/guide/dashboard")}
          className="back-btn"
        >
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Hero Header Section */}
      <div className="profile-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-pattern"></div>
        </div>

        <div className="hero-content">
          <div className="profile-banner">
            <div className="profile-avatar-section">
              <div className="avatar-wrapper">
                <div className="avatar-container">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <FaUser />
                    </div>
                  )}
                </div>

                <div className="avatar-upload-wrapper">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    className="avatar-edit-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    title={uploadingAvatar ? "Uploading..." : "Change profile photo"}
                  >
                    {uploadingAvatar ? <FaClock /> : <FaCamera />}
                  </button>
                </div>

                <div className="avatar-ring"></div>
              </div>

              <div className="profile-header-info">
                <h1 className="profile-name">
                  {profile.user_name || profile.name || "Guide"}
                </h1>

                <div className="profile-badges">
                  <div className="verification-badge">
                    {getVerificationIcon(profile.verification_status)}
                    <span
                      className={`status-text ${profile.verification_status}`}
                    >
                      {profile.verification_status?.charAt(0).toUpperCase() +
                        profile.verification_status?.slice(1) || "Pending"}
                    </span>
                  </div>

                  <div className="rating-badge">
                    <FaStar className="rating-star" />
                    <span className="rating-value">
                      {formatRating(profile.rating)}
                    </span>
                    <span className="review-count">
                      ({profile.total_reviews || 0} reviews)
                    </span>
                  </div>
                </div>

                <div className="profile-quick-stats">
                  <div className="quick-stat">
                    <FaMapMarkerAlt className="stat-icon" />
                    <span>{profile.location || "Location not set"}</span>
                  </div>
                  <div className="quick-stat">
                    <FaDollarSign className="stat-icon" />
                    <span>${profile.price_per_hour || 0}/hour</span>
                  </div>
                  <div className="quick-stat">
                    <FaCalendarAlt className="stat-icon" />
                    <span>{profile.experience_years || 0} years exp.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <button
                onClick={() => setEditing(true)}
                className="edit-profile-button"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main-content">
        <div className="content-wrapper">
          {/* About Section */}
          {profile.description && (
            <div className="profile-section about-section">
              <div className="section-header">
                <div className="section-icon">
                  <FaUser />
                </div>
                <h2>About Me</h2>
              </div>
              <div className="section-content">
                <p className="about-text">{profile.description}</p>
              </div>
            </div>
          )}

          {/* Information Grid */}
          <div className="profile-grid">
            {/* Personal Information Card */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon personal">
                  <FaUser />
                </div>
                <div className="card-title">
                  <h3>Personal Information</h3>
                  <p>Basic contact details</p>
                </div>
              </div>

              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <FaUser />
                    </div>
                    <div className="info-details">
                      <label>Full Name</label>
                      <span>
                        {profile.user_name || profile.name || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaEnvelope />
                    </div>
                    <div className="info-details">
                      <label>Email</label>
                      <span>{profile.user_email || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaPhone />
                    </div>
                    <div className="info-details">
                      <label>Phone</label>
                      <span>{profile.phone || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="info-details">
                      <label>Location</label>
                      <span>{profile.location || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information Card */}
            <div className="info-card">
              <div className="card-header">
                <div className="card-icon professional">
                  <FaGraduationCap />
                </div>
                <div className="card-title">
                  <h3>Professional Details</h3>
                  <p>Skills and expertise</p>
                </div>
              </div>

              <div className="card-body">
                <div className="info-grid">
                  <div className="info-item full-width">
                    <div className="info-icon">
                      <FaLanguage />
                    </div>
                    <div className="info-details">
                      <label>Languages</label>
                      <div className="language-tags">
                        {formatLanguages(profile.languages)
                          .split(", ")
                          .map((lang, index) => (
                            <span key={index} className="language-tag">
                              {lang}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="info-details">
                      <label>Experience</label>
                      <span>{profile.experience_years || 0} years</span>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <FaDollarSign />
                    </div>
                    <div className="info-details">
                      <label>Hourly Rate</label>
                      <span className="price">
                        ${profile.price_per_hour || 0}
                      </span>
                    </div>
                  </div>

                  <div className="info-item full-width">
                    <div className="info-icon">
                      <FaGlobe />
                    </div>
                    <div className="info-details">
                      <label>Specialties</label>
                      <div className="specialty-tags">
                        {formatSpecialties(profile.specialties)
                          .split(", ")
                          .map((specialty, index) => (
                            <span key={index} className="specialty-tag">
                              {specialty}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="info-card stats-card">
              <div className="card-header">
                <div className="card-icon stats">
                  <FaAward />
                </div>
                <div className="card-title">
                  <h3>Performance Stats</h3>
                  <p>Your guide metrics</p>
                </div>
              </div>

              <div className="card-body">
                <div className="stats-grid">
                  <div className="stat-box reviews-rating-box">
                    <div className="stat-icon reviews">
                      <FaStar />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {profile.total_reviews || 0}
                      </div>
                      <div className="stat-label">Reviews</div>
                      <div className="rating-info">
                        <FaStar className="rating-star" />
                        <span className="rating-value">
                          {formatRating(profile.rating)}
                        </span>
                        <span className="rating-text">avg rating</span>
                      </div>
                    </div>
                  </div>

                  {/* <div className="stat-box">
                    <div className="stat-icon experience">
                      <FaCalendarAlt />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {profile.experience_years || 0}
                      </div>
                      <div className="stat-label">Years Experience</div>
                    </div>
                  </div> */}

                  {/* <div className="stat-box">
                    <div className="stat-icon tours">
                      <FaGlobe />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {profile.total_tours || 0}
                      </div>
                      <div className="stat-label">Tours Created</div>
                    </div>
                  </div> */}

                  {/* <div className="stat-box">
                    <div className="stat-icon status">
                      <FaCheckCircle />
                    </div>
                    <div className="stat-content">
                      <div className="stat-value">
                        {profile.is_available ? "Available" : "Busy"}
                      </div>
                      <div className="stat-label">Status</div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Certificates and Certificate Images Row */}
            <div className="certificates-row">
              {/* Certificates */}
              {profile.certificates && (
                <div className="info-card certificates-card">
                  <div className="card-header">
                    <div className="card-icon certificates">
                      <FaAward />
                    </div>
                    <div className="card-title">
                      <h3>Certifications</h3>
                      <p>Professional qualifications</p>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="certificates-list">
                      {(typeof profile.certificates === "string"
                        ? profile.certificates.split(",")
                        : profile.certificates
                      ).map((cert, index) => (
                        <div key={index} className="certificate-item">
                          <div className="cert-icon">
                            <FaAward />
                          </div>
                          <span className="cert-text">{cert.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Certificate Images Summary */}
              {profile.certificate_img && (
                <div className="info-card certificate-images-summary-card">
                  <div className="card-header">
                    <div className="card-icon certificate-images">
                      <FaCamera />
                    </div>
                    <div className="card-title">
                      <h3>Certificate Images</h3>
                      <p>Proof of qualifications</p>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="certificate-images-summary">
                      {(() => {
                        let imageUrls = [];
                        
                        // Parse certificate_img if it's a JSON string
                        if (typeof profile.certificate_img === 'string') {
                          try {
                            const parsed = JSON.parse(profile.certificate_img);
                            imageUrls = Array.isArray(parsed) ? parsed : [profile.certificate_img];
                          } catch {
                            imageUrls = [profile.certificate_img];
                          }
                        } else if (Array.isArray(profile.certificate_img)) {
                          imageUrls = profile.certificate_img;
                        } else {
                          imageUrls = [];
                        }

                        // Show only first 2 certificates
                        const displayUrls = imageUrls.slice(0, 2);
                        const hasMore = imageUrls.length > 2;

                        return (
                          <>
                            {displayUrls.map((imageUrl, index) => (
                              <div key={index} className="certificate-summary-item">
                                <div className="cert-icon">
                                  <FaAward />
                                </div>
                                <span className="cert-text">
                                  Certificate {index + 1}
                                </span>
                              </div>
                            ))}
                            {hasMore && (
                              <div className="certificate-summary-item">
                                <div className="cert-icon">
                                  <FaAward />
                                </div>
                                <span className="cert-text">
                                  +{imageUrls.length - 2} more certificates
                                </span>
                              </div>
                            )}
                            <button
                              className="view-all-certificates-btn"
                              onClick={() => setShowCertificateModal(true)}
                            >
                              <FaEye />
                              <span>View All Images</span>
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Certificate Images Modal */}
            {showCertificateModal && profile.certificate_img && (
              <div className="certificate-modal-overlay" onClick={() => setShowCertificateModal(false)}>
                <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>Certificate Images</h3>
                    <button 
                      className="modal-close-btn"
                      onClick={() => setShowCertificateModal(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="certificate-images-list">
                      {(() => {
                        let imageUrls = [];
                        
                        // Parse certificate_img if it's a JSON string
                        if (typeof profile.certificate_img === 'string') {
                          try {
                            const parsed = JSON.parse(profile.certificate_img);
                            imageUrls = Array.isArray(parsed) ? parsed : [profile.certificate_img];
                          } catch {
                            imageUrls = [profile.certificate_img];
                          }
                        } else if (Array.isArray(profile.certificate_img)) {
                          imageUrls = profile.certificate_img;
                        } else {
                          imageUrls = [];
                        }

                        return imageUrls.map((imageUrl, index) => (
                          <div key={index} className="certificate-image-list-item">
                            <div className="certificate-image-header">
                              <div className="certificate-number">
                                <FaAward />
                                <span>Certificate {index + 1}</span>
                              </div>
                            </div>
                            <div className="certificate-image-container">
                              <img
                                src={imageUrl}
                                alt={`Certificate ${index + 1}`}
                                className="certificate-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="image-error" style={{ display: 'none' }}>
                                <p>Unable to load image</p>
                                <small>Check the URL</small>
                              </div>
                            </div>
                            <div className="certificate-image-url">
                              <small>{imageUrl}</small>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
