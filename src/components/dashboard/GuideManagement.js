import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import Loading from "../Loading";
import {
  FaEye,
  FaUserCheck,
  FaTimes,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import "./GuideManagement.css";

const GuideManagement = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verification_status: "",
    search: "",
    page: 1,
    limit: 10,
  });
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all guides and filter on frontend for better search performance
      const data = await adminService.getAllGuides({ page: 1, limit: 1000 });
      // Handle different response formats
      if (Array.isArray(data)) {
        setGuides(data);
      } else if (data.guides && Array.isArray(data.guides)) {
        setGuides(data.guides);
      } else if (data.data && Array.isArray(data.data)) {
        setGuides(data.data);
      } else {
        console.warn("Unexpected response format:", data);
        setGuides([]);
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      alert(
        "Failed to fetch guides. Please check your connection and try again."
      );
      setGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  // Filter guides based on search term and status
  useEffect(() => {
    let filtered = guides;

    // Filter by search term (name, email, location)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (guide) =>
          guide.user_name?.toLowerCase().includes(searchTerm) ||
          guide.user_email?.toLowerCase().includes(searchTerm) ||
          guide.location?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by verification status
    if (filters.verification_status) {
      filtered = filtered.filter(
        (guide) => guide.verification_status === filters.verification_status
      );
    }

    setFilteredGuides(filtered);
  }, [guides, filters.search, filters.verification_status]);

  const handleVerificationUpdate = async (guideId, status) => {
    try {
      await adminService.verifyGuide(guideId, status);
      alert(`Guide ${status} successfully`);
      fetchGuides(); // Refresh the list
    } catch (error) {
      console.error("Error updating guide verification:", error);
      alert(
        `Failed to update guide verification: ${
          error.message || "Unknown error"
        }`
      );
    }
  };

  const handleViewGuide = (guide) => {
    setSelectedGuide(guide);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "success";
      case "rejected":
        return "danger";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="guide-management">
      <div className="guide-management-header">
        <h2>Guide Management</h2>
        <div className="filters">
          <input
            type="text"
            placeholder="Search guides by name, email, or location..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <select
            value={filters.verification_status}
            onChange={(e) =>
              setFilters({ ...filters, verification_status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      <div className="guides-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Languages</th>
              <th>Experience</th>
              <th>Verification Status</th>
              <th>Rating</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuides &&
              filteredGuides.map((guide) => (
                <tr key={guide.id}>
                  <td>{guide.id}</td>
                  <td>{guide.user_name}</td>
                  <td>{guide.user_email}</td>
                  <td>{guide.location}</td>
                  <td>{guide.languages}</td>
                  <td>
                    {guide.experience_years
                      ? `${guide.experience_years} years`
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusColor(
                        guide.verification_status
                      )}`}
                    >
                      {guide.verification_status}
                    </span>
                  </td>
                  <td>{guide.rating ? `${guide.rating}/5` : "N/A"}</td>
                  <td>{new Date(guide.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewGuide(guide)}
                        className="btn-view"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {guide.verification_status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleVerificationUpdate(guide.id, "verified")
                            }
                            className="btn-approve"
                            title="Approve Guide"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleVerificationUpdate(guide.id, "rejected")
                            }
                            className="btn-reject"
                            title="Reject Guide"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {guide.verification_status === "rejected" && (
                        <button
                          onClick={() =>
                            handleVerificationUpdate(guide.id, "verified")
                          }
                          className="btn-approve"
                          title="Approve Guide"
                        >
                          <FaUserCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Guide Details Modal */}
      {showModal && selectedGuide && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Guide Details</h3>
              <span
                className={`status-badge ${getStatusColor(
                  selectedGuide.verification_status
                )}`}
              >
                {selectedGuide.verification_status}
              </span>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="guide-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Guide ID</label>
                    <div className="form-control">{selectedGuide.id}</div>
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="form-control">
                      {selectedGuide.user_name}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="form-control">
                      {selectedGuide.user_email}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="form-control">
                      {selectedGuide.phone || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <div className="form-control">{selectedGuide.location}</div>
                  </div>
                  <div className="form-group">
                    <label>Experience Years</label>
                    <div className="form-control">
                      {selectedGuide.experience_years} years
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price per Hour</label>
                    <div className="form-control price">
                      ${selectedGuide.price_per_hour}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Availability Status</label>
                    <div
                      className={`form-control ${
                        selectedGuide.is_available ? "available" : "unavailable"
                      }`}
                    >
                      {selectedGuide.is_available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Languages</label>
                    <div className="form-control">
                      {Array.isArray(selectedGuide.languages)
                        ? selectedGuide.languages.join(", ")
                        : selectedGuide.languages || "Not specified"}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Specialties</label>
                    <div className="form-control">
                      {Array.isArray(selectedGuide.specialties)
                        ? selectedGuide.specialties.join(", ")
                        : selectedGuide.specialties || "Not specified"}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating</label>
                    <div className="form-control rating">
                      <span className="rating-value">
                        {parseFloat(selectedGuide.rating || 0).toFixed(1)}/5
                      </span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(selectedGuide.rating || 0)
                                ? "star filled"
                                : "star"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Total Reviews</label>
                    <div className="form-control">
                      {selectedGuide.total_reviews || 0} reviews
                    </div>
                  </div>
                </div>

                {selectedGuide.certificates && (
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Certificates</label>
                      <div className="form-control">
                        {Array.isArray(selectedGuide.certificates)
                          ? selectedGuide.certificates.join(", ")
                          : selectedGuide.certificates}
                      </div>
                    </div>
                  </div>
                )}

                {selectedGuide.description && (
                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Description</label>
                      <div className="form-control description">
                        {selectedGuide.description}
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Current Location</label>
                    <div className="form-control">
                      {selectedGuide.current_location || "Not tracking"}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Verification Status</label>
                    <div
                      className={`form-control status ${selectedGuide.verification_status}`}
                    >
                      {selectedGuide.verification_status}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {selectedGuide.verification_status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleVerificationUpdate(selectedGuide.id, "verified");
                      setShowModal(false);
                    }}
                    className="btn btn-approve"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => {
                      handleVerificationUpdate(selectedGuide.id, "rejected");
                      setShowModal(false);
                    }}
                    className="btn btn-reject"
                  >
                    <FaTimes /> Reject
                  </button>
                </>
              )}
              {selectedGuide.verification_status === "rejected" && (
                <button
                  onClick={() => {
                    handleVerificationUpdate(selectedGuide.id, "verified");
                    setShowModal(false);
                  }}
                  className="btn btn-approve"
                >
                  <FaUserCheck /> Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideManagement;
