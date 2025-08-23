import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { guidesService } from "../../services/guidesService";
import GuideProfileEditor from "./GuideProfileEditor";
import Loading from "../Loading";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaUser,
  FaSearch,
  FaMapMarkerAlt,
  FaLanguage,
  FaStar,
  FaDollarSign,
  FaCalendarAlt,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import "./GuideComponents.css";

const GuideManagement = () => {
  const { user } = useAuth();

  const [view, setView] = useState("list"); // list, create, edit, view
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all guides on component mount
  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      // This assumes you have a getGuides method that gets all guides
      const response = await guidesService.getGuides();
      setGuides(response.data.guides ?? response);
    } catch (error) {
      console.error("Error loading guides:", error);
      setError("Failed to load guides");
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGuide = async (guideId) => {
    try {
      setLoading(true);
      // GET /api/guides/{id} - Get guide profile by ID
      const guide = await guidesService.getGuideById(guideId);
      setSelectedGuide(guide);
      setView("view");
    } catch (error) {
      console.error("Error loading guide:", error);
      alert("Failed to load guide details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGuide = async (guideId) => {
    try {
      setLoading(true);
      // GET /api/guides/{id} - Get guide profile by ID
      const guide = await guidesService.getGuideById(guideId);
      setSelectedGuide(guide);
      setView("edit");
    } catch (error) {
      console.error("Error loading guide:", error);
      alert("Failed to load guide details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuide = async (guideId) => {
    if (
      !window.confirm("Are you sure you want to delete this guide profile?")
    ) {
      return;
    }

    try {
      await guidesService.deleteGuide(guideId);
      alert("Guide profile deleted successfully!");
      loadGuides(); // Reload the list
    } catch (error) {
      console.error("Error deleting guide:", error);
      alert("Failed to delete guide profile");
    }
  };

  const handleCreateNewGuide = () => {
    setSelectedGuide(null);
    setView("create");
  };

  const handleCreateProfileForUser = () => {
    setSelectedGuide(null);
    setView("createProfile");
  };

  const handleSaveSuccess = (savedGuide) => {
    setView("list");
    setSelectedGuide(null);
    loadGuides(); // Reload the list
  };

  const handleCancel = () => {
    setView("list");
    setSelectedGuide(null);
  };

  const filteredGuides = guides.filter((guide) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      (guide.location && guide.location.toLowerCase().includes(searchLower)) ||
      (guide.description &&
        guide.description.toLowerCase().includes(searchLower)) ||
      (guide.specialties &&
        guide.specialties.some((spec) =>
          spec.toLowerCase().includes(searchLower)
        )) ||
      (guide.languages &&
        guide.languages.some((lang) =>
          lang.toLowerCase().includes(searchLower)
        )) ||
      (guide.user_name && guide.user_name.toLowerCase().includes(searchLower))
    );
  });

  if (view === "create") {
    return (
      <div className="guide-management">
        <div className="page-header">
          <button onClick={handleCancel} className="back-btn">
            <FaArrowLeft /> Back to List
          </button>
          <h2>Create New Guide Profile</h2>
        </div>
        <GuideProfileEditor
          mode="create"
          onSave={handleSaveSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (view === "createProfile") {
    return (
      <div className="guide-management">
        <div className="page-header">
          <button onClick={handleCancel} className="back-btn">
            <FaArrowLeft /> Back to List
          </button>
          <h2>Create Guide Profile for Current User</h2>
        </div>
        <GuideProfileEditor
          mode="createProfile"
          userId={user?.id}
          onSave={handleSaveSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (view === "edit" && selectedGuide) {
    return (
      <div className="guide-management">
        <div className="page-header">
          <button onClick={handleCancel} className="back-btn">
            <FaArrowLeft /> Back to List
          </button>
          <h2>Edit Guide Profile</h2>
        </div>
        <GuideProfileEditor
          mode="edit"
          guideId={selectedGuide.id}
          initialData={selectedGuide}
          onSave={handleSaveSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (view === "view" && selectedGuide) {
    return (
      <div className="guide-management">
        <div className="page-header">
          <button onClick={handleCancel} className="back-btn">
            <FaArrowLeft /> Back to List
          </button>
          <h2>Guide Profile Details</h2>
        </div>

        <div className="guide-profile-view">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <FaUser />
              </div>
              <div className="profile-info">
                <h3>{selectedGuide.user_name || "Guide Profile"}</h3>
                <p className="profile-location">
                  <FaMapMarkerAlt /> {selectedGuide.location}
                </p>
                <p className="profile-price">
                  <FaDollarSign /> ${selectedGuide.price_per_hour}/hour
                </p>
              </div>
              <div className="profile-actions">
                <button
                  onClick={() => handleEditGuide(selectedGuide.id)}
                  className="edit-btn"
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <h4>
                  <FaCalendarAlt /> Experience
                </h4>
                <p>{selectedGuide.experience_years} years</p>
              </div>

              <div className="detail-section">
                <h4>
                  <FaLanguage /> Languages
                </h4>
                <div className="tags">
                  {(selectedGuide.languages || []).map((lang, index) => (
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
                  {(selectedGuide.specialties || []).map((spec, index) => (
                    <span key={index} className="tag">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {selectedGuide.certificates &&
                selectedGuide.certificates.length > 0 && (
                  <div className="detail-section">
                    <h4>Certificates</h4>
                    <ul>
                      {selectedGuide.certificates.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedGuide.description && (
                <div className="detail-section">
                  <h4>About</h4>
                  <p>{selectedGuide.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guide-management">
      <div className="page-header">
        <h2>Guide Management</h2>
        <div className="header-actions">
          <button onClick={handleCreateNewGuide} className="create-btn">
            <FaPlus /> Create New Guide
          </button>
          <button onClick={handleCreateProfileForUser} className="create-btn">
            <FaUser /> Create My Profile
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search guides by location, specialties, languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadGuides} className="retry-btn">
            Try Again
          </button>
        </div>
      ) : (
        <div className="guides-grid">
          {filteredGuides.length === 0 ? (
            <div className="empty-state">
              <FaUser size={48} />
              <h3>No guides found</h3>
              <p>
                {searchTerm
                  ? "No guides match your search criteria"
                  : "No guide profiles have been created yet"}
              </p>
              {!searchTerm && (
                <button onClick={handleCreateNewGuide} className="create-btn">
                  <FaPlus /> Create First Guide
                </button>
              )}
            </div>
          ) : (
            filteredGuides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-card-header">
                  <div className="guide-avatar">
                    <FaUser />
                  </div>
                  <div className="guide-info">
                    <h3>{guide.user_name || `Guide #${guide.id}`}</h3>
                    <p className="guide-location">
                      <FaMapMarkerAlt /> {guide.location}
                    </p>
                    <p className="guide-price">
                      <FaDollarSign /> ${guide.price_per_hour}/hour
                    </p>
                  </div>
                </div>

                <div className="guide-card-body">
                  <div className="guide-experience">
                    <FaCalendarAlt /> {guide.experience_years} years experience
                  </div>

                  <div className="guide-languages">
                    <FaLanguage />{" "}
                    {(guide.languages || []).slice(0, 2).join(", ")}
                    {guide.languages && guide.languages.length > 2 && (
                      <span> +{guide.languages.length - 2} more</span>
                    )}
                  </div>

                  <div className="guide-specialties">
                    <FaStar />{" "}
                    {(guide.specialties || []).slice(0, 2).join(", ")}
                    {guide.specialties && guide.specialties.length > 2 && (
                      <span> +{guide.specialties.length - 2} more</span>
                    )}
                  </div>

                  {guide.description && (
                    <p className="guide-description">
                      {guide.description.length > 100
                        ? `${guide.description.substring(0, 100)}...`
                        : guide.description}
                    </p>
                  )}
                </div>

                <div className="guide-card-actions">
                  <button
                    onClick={() => handleViewGuide(guide.id)}
                    className="view-btn"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => handleEditGuide(guide.id)}
                    className="edit-btn"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGuide(guide.id)}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GuideManagement;
