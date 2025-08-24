import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import Loading from "../Loading";
import { FaCheck, FaTimes, FaEye, FaUserCheck } from "react-icons/fa";
import "./GuideManagement.css";

const GuideManagement = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verification_status: "",
    page: 1,
    limit: 10,
  });
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllGuides(filters);
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
  }, [filters]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

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
          <select
            value={filters.verification_status}
            onChange={(e) =>
              setFilters({ ...filters, verification_status: e.target.value })
            }
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
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
            {guides &&
              guides.map((guide) => (
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
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="guide-detail-item">
                <strong>ID:</strong> {selectedGuide.id}
              </div>
              <div className="guide-detail-item">
                <strong>Name:</strong> {selectedGuide.user_name}
              </div>
              <div className="guide-detail-item">
                <strong>Email:</strong> {selectedGuide.user_email}
              </div>
              <div className="guide-detail-item">
                <strong>Phone:</strong> {selectedGuide.phone || "N/A"}
              </div>
              <div className="guide-detail-item">
                <strong>Location:</strong> {selectedGuide.location}
              </div>
              <div className="guide-detail-item">
                <strong>Languages:</strong> {selectedGuide.languages}
              </div>
              <div className="guide-detail-item">
                <strong>Experience:</strong>{" "}
                {selectedGuide.experience_years
                  ? `${selectedGuide.experience_years} years`
                  : "N/A"}
              </div>
              <div className="guide-detail-item">
                <strong>Bio:</strong> {selectedGuide.bio || "N/A"}
              </div>
              <div className="guide-detail-item">
                <strong>Verification Status:</strong>
                <span
                  className={`status-badge ${getStatusColor(
                    selectedGuide.verification_status
                  )}`}
                >
                  {selectedGuide.verification_status}
                </span>
              </div>
              <div className="guide-detail-item">
                <strong>Rating:</strong>{" "}
                {selectedGuide.rating ? `${selectedGuide.rating}/5` : "N/A"}
              </div>
              <div className="guide-detail-item">
                <strong>Total Tours:</strong> {selectedGuide.total_tours || 0}
              </div>
              <div className="guide-detail-item">
                <strong>Created:</strong>{" "}
                {new Date(selectedGuide.created_at).toLocaleString()}
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
                    className="btn btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleVerificationUpdate(selectedGuide.id, "rejected");
                      setShowModal(false);
                    }}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </>
              )}
              {selectedGuide.verification_status === "rejected" && (
                <button
                  onClick={() => {
                    handleVerificationUpdate(selectedGuide.id, "verified");
                    setShowModal(false);
                  }}
                  className="btn btn-success"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideManagement;
