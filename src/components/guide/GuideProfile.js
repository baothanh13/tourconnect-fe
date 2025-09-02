import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
} from "react-icons/fa";
import "./GuideComponents.css";
import "./GuideProfile.css";

const GuideProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="modern-guide-profile">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-header-bg">
          <div className="header-overlay"></div>
        </div>

        <div className="profile-header-content">
          <div className="profile-avatar">
            <div className="avatar-container">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  <FaUser />
                </div>
              )}
              <button className="avatar-edit-btn">
                <FaCamera />
              </button>
            </div>
          </div>

          <div className="profile-header-info">
            <h1>{profile.user_name || profile.name || "Guide"}</h1>
            <div className="verification-status">
              {getVerificationIcon(profile.verification_status)}
              <span className={`status-text ${profile.verification_status}`}>
                {profile.verification_status?.charAt(0).toUpperCase() +
                  profile.verification_status?.slice(1) || "Pending"}
              </span>
            </div>
            <div className="profile-rating">
              <FaStar className="rating-star" />
              <span>{formatRating(profile.rating)}</span>
              <span className="review-count">
                ({profile.total_reviews || 0} reviews)
              </span>
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              onClick={() => setEditing(true)}
              className="edit-profile-btn"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-grid">
          {/* Personal Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <FaUser className="card-icon" />
              <h3>Personal Information</h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <FaUser className="info-icon" />
                <div className="info-content">
                  <label>Full Name</label>
                  <span>
                    {profile.user_name || profile.name || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="info-content">
                  <label>Email</label>
                  <span>{profile.user_email || "Not specified"}</span>
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div className="info-content">
                  <label>Phone</label>
                  <span>{profile.phone || "Not specified"}</span>
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-content">
                  <label>Location</label>
                  <span>{profile.location || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <FaGraduationCap className="card-icon" />
              <h3>Professional Information</h3>
            </div>
            <div className="card-content">
              <div className="info-item">
                <FaLanguage className="info-icon" />
                <div className="info-content">
                  <label>Languages</label>
                  <span>{formatLanguages(profile.languages)}</span>
                </div>
              </div>

              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div className="info-content">
                  <label>Experience</label>
                  <span>{profile.experience_years || 0} years</span>
                </div>
              </div>

              <div className="info-item">
                <FaDollarSign className="info-icon" />
                <div className="info-content">
                  <label>Price per Hour</label>
                  <span>${profile.price_per_hour || 0}</span>
                </div>
              </div>

              <div className="info-item">
                <FaGlobe className="info-icon" />
                <div className="info-content">
                  <label>Specialties</label>
                  <span>{formatSpecialties(profile.specialties)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {profile.description && (
            <div className="profile-card full-width">
              <div className="card-header">
                <FaUser className="card-icon" />
                <h3>About Me</h3>
              </div>
              <div className="card-content">
                <div className="about-content">
                  <p>{profile.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Card */}
          <div className="profile-card">
            <div className="card-header">
              <FaAward className="card-icon" />
              <h3>Statistics</h3>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{profile.total_reviews || 0}</div>
                  <div className="stat-label">Reviews</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {formatRating(profile.rating)}
                  </div>
                  <div className="stat-label">Rating</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {profile.experience_years || 0}
                  </div>
                  <div className="stat-label">Years</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {profile.is_available ? "Available" : "Busy"}
                  </div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates */}
          {profile.certificates && (
            <div className="profile-card">
              <div className="card-header">
                <FaAward className="card-icon" />
                <h3>Certificates</h3>
              </div>
              <div className="card-content">
                <div className="certificates-content">
                  <p>{profile.certificates}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
