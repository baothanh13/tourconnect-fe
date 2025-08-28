import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../Loading";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaExclamationTriangle,
  FaCheckCircle,
  FaStar,
  FaRoute,
} from "react-icons/fa";
import "./TouristProfile.css";

const TouristProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar_url: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedTours: 0,
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        avatar_url: user.avatar_url || "",
      });
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    // For now, use mock stats - will be replaced with real API call
    setStats({
      totalBookings: 12,
      completedTours: 8,
      averageRating: 4.5,
      totalReviews: 7,
    });
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Here you would call the API to update the profile
      // await userService.updateProfile(user.id, profile);

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the user context
      updateUser({ ...user, ...profile });

      setEditMode(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
    });
    setEditMode(false);
    setError(null);
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange("avatar_url", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`star ${star <= rating ? "filled" : "empty"}`}
          />
        ))}
      </div>
    );
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="tourist-profile">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and preferences</p>
      </div>

      {error && (
        <div className="message error-message">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="message success-message">
          <FaCheckCircle />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>Personal Information</h3>
            {!editMode ? (
              <button className="btn-primary" onClick={() => setEditMode(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  className="btn-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaSave /> Save
                    </>
                  )}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          <div className="profile-card-body">
            {/* Avatar Section */}
            <div className="avatar-section">
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
                {editMode && (
                  <div className="avatar-upload">
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="avatar-upload-btn"
                    >
                      <FaCamera />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="profile-fields">
              <div className="field-row">
                <div className="field-group">
                  <label>
                    <FaUser className="field-icon" />
                    Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your name"
                    />
                  ) : (
                    <span className="field-value">
                      {profile.name || "Not provided"}
                    </span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <FaEnvelope className="field-icon" />
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                    />
                  ) : (
                    <span className="field-value">
                      {profile.email || "Not provided"}
                    </span>
                  )}
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>
                    <FaPhone className="field-icon" />
                    Phone
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <span className="field-value">
                      {profile.phone || "Not provided"}
                    </span>
                  )}
                </div>

                <div className="field-group">
                  <label>
                    <FaMapMarkerAlt className="field-icon" />
                    Location
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="Enter your location"
                    />
                  ) : (
                    <span className="field-value">
                      {profile.location || "Not provided"}
                    </span>
                  )}
                </div>
              </div>

              <div className="field-group full-width">
                <label>Bio</label>
                {editMode ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                ) : (
                  <span className="field-value bio">
                    {profile.bio || "No bio provided"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h3>Travel Statistics</h3>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon bookings">
                <FaCalendarAlt />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalBookings}</span>
                <span className="stat-label">Total Bookings</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon completed">
                <FaRoute />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.completedTours}</span>
                <span className="stat-label">Completed Tours</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon rating">
                <FaStar />
              </div>
              <div className="stat-info">
                <div className="rating-display">
                  {renderStars(Math.floor(stats.averageRating))}
                  <span className="rating-value">{stats.averageRating}</span>
                </div>
                <span className="stat-label">Average Rating Given</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon reviews">
                <FaStar />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stats.totalReviews}</span>
                <span className="stat-label">Reviews Written</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristProfile;
