import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { guidesService } from "../../services/guidesService";
import GuideProfileEditor from "./GuideProfileEditor";
import Loading from "../Loading";
import {
  FaSearch,
  FaUser,
  FaEdit,
  FaPlus,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaLanguage,
  FaStar,
} from "react-icons/fa";
import "./GuideComponents.css";

const FindGuideByUser = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(user?.id || "");
  const [guideProfile, setGuideProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("search"); // search, view, edit, create

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!userId.trim()) {
      alert("Please enter a User ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // GET /api/guides/user/{userId} - Get guide profile by user ID
      const guide = await guidesService.getGuideByUserId(userId);
      setGuideProfile(guide);
      setView("view");
    } catch (error) {
      console.error("Error finding guide by user ID:", error);
      if (error.message.includes("not found")) {
        setError(`No guide profile found for User ID: ${userId}`);
        setGuideProfile(null);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    setView("create");
  };

  const handleEditProfile = () => {
    setView("edit");
  };

  const handleBackToSearch = () => {
    setView("search");
    setGuideProfile(null);
    setError(null);
  };

  const handleSaveSuccess = (savedGuide) => {
    setGuideProfile(savedGuide);
    setView("view");
  };

  if (view === "create") {
    return (
      <div className="find-guide-by-user">
        <div className="page-header">
          <button onClick={handleBackToSearch} className="back-btn">
            ← Back to Search
          </button>
          <h2>Create Guide Profile</h2>
        </div>
        <GuideProfileEditor
          mode="createProfile"
          userId={userId}
          onSave={handleSaveSuccess}
          onCancel={handleBackToSearch}
        />
      </div>
    );
  }

  if (view === "edit" && guideProfile) {
    return (
      <div className="find-guide-by-user">
        <div className="page-header">
          <button onClick={handleBackToSearch} className="back-btn">
            ← Back to Search
          </button>
          <h2>Edit Guide Profile</h2>
        </div>
        <GuideProfileEditor
          mode="edit"
          guideId={guideProfile.id}
          initialData={guideProfile}
          onSave={handleSaveSuccess}
          onCancel={handleBackToSearch}
        />
      </div>
    );
  }

  if (view === "view" && guideProfile) {
    return (
      <div className="find-guide-by-user">
        <div className="page-header">
          <button onClick={handleBackToSearch} className="back-btn">
            ← Back to Search
          </button>
          <h2>Guide Profile Found</h2>
        </div>

        <div className="guide-profile-display">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FaUser />
              </div>
              <div className="profile-info">
                <h3>{guideProfile.user_name || `Guide #${guideProfile.id}`}</h3>
                <p className="profile-id">User ID: {userId}</p>
                <p className="profile-location">
                  <FaMapMarkerAlt /> {guideProfile.location}
                </p>
                <p className="profile-price">
                  <FaDollarSign /> ${guideProfile.price_per_hour}/hour
                </p>
              </div>
              <div className="profile-actions">
                <button onClick={handleEditProfile} className="edit-btn">
                  <FaEdit /> Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <div className="detail-item">
                  <FaCalendarAlt />
                  <span>Experience: {guideProfile.experience_years} years</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>
                  <FaLanguage /> Languages
                </h4>
                <div className="tags">
                  {(guideProfile.languages || []).map((lang, index) => (
                    <span key={index} className="tag">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4>
                  <FaStar /> Specialties
                </h4>
                <div className="tags">
                  {(guideProfile.specialties || []).map((spec, index) => (
                    <span key={index} className="tag">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {guideProfile.certificates &&
                guideProfile.certificates.length > 0 && (
                  <div className="detail-section">
                    <h4>Certificates</h4>
                    <ul className="certificates-list">
                      {guideProfile.certificates.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {guideProfile.description && (
                <div className="detail-section">
                  <h4>About</h4>
                  <p className="description">{guideProfile.description}</p>
                </div>
              )}

              <div className="profile-metadata">
                <p>
                  <strong>Profile ID:</strong> {guideProfile.id}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(guideProfile.created_at).toLocaleDateString()}
                </p>
                {guideProfile.updated_at && (
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(guideProfile.updated_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="find-guide-by-user">
      <div className="page-header">
        <h2>Find Guide by User ID</h2>
        <p>Search for a guide profile using their User ID</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <FaUser />
            <input
              type="text"
              placeholder="Enter User ID (e.g., 12345)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="search-btn">
              <FaSearch />
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {user && (
          <div className="current-user-info">
            <p>
              <strong>Your User ID:</strong> {user.id}
              <button
                type="button"
                onClick={() => setUserId(user.id)}
                className="use-my-id-btn"
              >
                Use My ID
              </button>
            </p>
          </div>
        )}
      </div>

      {loading && <Loading />}

      {error && (
        <div className="error-section">
          <div className="error-message">
            <p>{error}</p>
            {error.includes("not found") && (
              <div className="error-actions">
                <p>Would you like to create a guide profile for this user?</p>
                <button onClick={handleCreateProfile} className="create-btn">
                  <FaPlus /> Create Guide Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="api-info">
        <h3>API Endpoint Used</h3>
        <div className="api-details">
          <p>
            <strong>Method:</strong> GET
          </p>
          <p>
            <strong>Endpoint:</strong> /api/guides/user/{userId}
          </p>
          <p>
            <strong>Description:</strong> Get guide profile by user ID
          </p>
        </div>
      </div>
    </div>
  );
};

export default FindGuideByUser;
