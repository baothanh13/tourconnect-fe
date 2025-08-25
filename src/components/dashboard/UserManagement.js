import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import Loading from "../Loading";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaUser,
} from "react-icons/fa";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    page: 1,
    limit: 10,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
  });
  const [createFormData, setCreateFormData] = useState({
    email: "",
    password: "",
    role: "tourist",
    name: "",
    phone: "",
    avatar_url: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(filters);
      // Handle different response formats
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (data.data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        console.warn("Unexpected response format:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Show user-friendly error message
      alert(
        "Failed to fetch users. Please check your connection and try again."
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = () => {
    setCreateFormData({
      email: "",
      password: "",
      role: "tourist",
      name: "",
      phone: "",
      avatar_url: "",
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async () => {
    try {
      // Validate required fields
      if (
        !createFormData.email ||
        !createFormData.password ||
        !createFormData.name
      ) {
        alert("Please fill in all required fields (Email, Password, Name)");
        return;
      }

      console.log("Creating new user:", createFormData);
      const result = await adminService.createUser(createFormData);
      console.log("Create user result:", result);
      alert("User created successfully!");
      setShowCreateModal(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error creating user:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Failed to create user: " + (error.message || "Unknown error"));
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || user.full_name || "",
      phone: user.phone || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateProfile = async () => {
    try {
      console.log(`Updating profile for user ${selectedUser.id}`, editFormData);
      const result = await adminService.updateUserProfile(
        selectedUser.id,
        editFormData
      );
      console.log("Update result:", result);
      alert("User profile updated successfully!");
      setShowEditModal(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user profile:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        "Failed to update user profile: " + (error.message || "Unknown error")
      );
    }
  };

  const handleGuideVerification = async (userId, userRole, currentVerified) => {
    try {
      if (userRole !== "guide") {
        alert("This action is only available for guide users");
        return;
      }

      const newStatus = currentVerified ? "rejected" : "verified";
      console.log(
        `Updating guide verification for user ${userId} to ${newStatus}`
      );

      // Call the guide verification API
      const result = await adminService.verifyGuide(userId, newStatus);
      console.log("Guide verification result:", result);
      alert(`Guide ${newStatus} successfully!`);

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating guide verification:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        "Failed to update guide verification: " +
          (error.message || "Unknown error")
      );
    }
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      console.log(`Updating user ${userId} status to ${newStatus}`);
      // Use updateUserProfile to update user status
      const result = await adminService.updateUserProfile(userId, {
        is_active: newStatus === "active" ? 1 : 0,
      });
      console.log("Status update result:", result);
      alert(`User status updated to ${newStatus} successfully!`);

      // Close the modal if it's open
      if (showModal) {
        setShowModal(false);
      }

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user status:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        "Failed to update user status: " + (error.message || "Unknown error")
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteUser(userId);
        alert("User deleted successfully");
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div className="header-left">
          <h2>User Management</h2>
          <p>Manage all users and their permissions</p>
        </div>
        <div className="header-right">
          <button
            onClick={handleCreateUser}
            className="btn-create-user"
            title="Create New User"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Create New User
          </button>
          <div className="filters">
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="tourist">Tourist</option>
              <option value="guide">Guide</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name || user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      user.is_active ? "active" : "inactive"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  {user.is_verified ? (
                    <FaCheck className="verified-icon" />
                  ) : (
                    <FaTimes className="unverified-icon" />
                  )}
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="btn-view"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="btn-status activate"
                      title="Edit Profile"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleGuideVerification(
                          user.id,
                          user.role,
                          user.is_verified
                        )
                      }
                      className={`btn-status ${
                        user.role === "guide"
                          ? user.is_verified
                            ? "deactivate"
                            : "activate"
                          : "disabled"
                      }`}
                      title={
                        user.role === "guide"
                          ? user.is_verified
                            ? "Reject Guide Verification"
                            : "Verify Guide"
                          : "Only available for guides"
                      }
                      disabled={user.role !== "guide"}
                    >
                      {user.role === "guide" ? (
                        user.is_verified ? (
                          <FaToggleOn />
                        ) : (
                          <FaToggleOff />
                        )
                      ) : (
                        <FaTimes />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn-delete"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail-item">
                <strong>ID:</strong> {selectedUser.id}
              </div>
              <div className="user-detail-item">
                <strong>Name:</strong>{" "}
                {selectedUser.name || selectedUser.full_name}
              </div>
              <div className="user-detail-item">
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div className="user-detail-item">
                <strong>Role:</strong> {selectedUser.role}
              </div>
              <div className="user-detail-item">
                <strong>Status:</strong>{" "}
                {selectedUser.is_active ? "Active" : "Inactive"}
              </div>
              <div className="user-detail-item">
                <strong>Verified:</strong>{" "}
                {selectedUser.is_verified ? "Yes" : "No"}
              </div>
              <div className="user-detail-item">
                <strong>Phone:</strong> {selectedUser.phone || "N/A"}
              </div>
              <div className="user-detail-item">
                <strong>Created:</strong>{" "}
                {new Date(selectedUser.created_at).toLocaleString()}
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() =>
                  handleStatusUpdate(
                    selectedUser.id,
                    selectedUser.is_active ? "inactive" : "active"
                  )
                }
                className={`btn btn-status-toggle ${
                  selectedUser.is_active ? "btn-danger" : "btn-success"
                }`}
              >
                {selectedUser.is_active ? (
                  <>
                    <FaToggleOff style={{ marginRight: "8px" }} />
                    Deactivate
                  </>
                ) : (
                  <>
                    <FaToggleOn style={{ marginRight: "8px" }} />
                    Activate
                  </>
                )}
              </button>

              {selectedUser.role === "guide" && (
                <button
                  onClick={() =>
                    handleGuideVerification(
                      selectedUser.id,
                      selectedUser.role,
                      selectedUser.is_verified
                    )
                  }
                  className={`btn ${
                    selectedUser.is_verified ? "btn-danger" : "btn-success"
                  }`}
                >
                  {selectedUser.is_verified ? (
                    <>
                      <FaTimes style={{ marginRight: "8px" }} />
                      Reject Guide
                    </>
                  ) : (
                    <>
                      <FaCheck style={{ marginRight: "8px" }} />
                      Verify Guide
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="btn btn-close-modal"
              >
                <FaTimes style={{ marginRight: "8px" }} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Profile Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter user name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="tel"
                    id="phone"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleUpdateProfile} className="btn btn-apply">
                <FaCheck style={{ marginRight: "8px" }} />
                Apply Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-cancel"
              >
                <FaTimes style={{ marginRight: "8px" }} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="modal-content create-user-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                <FaUser style={{ marginRight: "10px" }} />
                Create New User
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="create-user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-name">Full Name *</label>
                    <input
                      type="text"
                      id="create-name"
                      value={createFormData.name}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-email">Email Address *</label>
                    <input
                      type="email"
                      id="create-email"
                      value={createFormData.email}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-password">Password *</label>
                    <input
                      type="password"
                      id="create-password"
                      value={createFormData.password}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-role">User Role *</label>
                    <select
                      id="create-role"
                      value={createFormData.role}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          role: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="tourist">Tourist</option>
                      <option value="guide">Guide</option>
                      <option value="admin">Admin</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="create-phone"
                      value={createFormData.phone}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number (optional)"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="create-avatar">Avatar URL</label>
                    <input
                      type="url"
                      id="create-avatar"
                      value={createFormData.avatar_url}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          avatar_url: e.target.value,
                        })
                      }
                      placeholder="Enter avatar URL (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCreateSubmit}
                className="btn btn-apply btn-create"
              >
                <FaPlus style={{ marginRight: "8px" }} />
                Create User
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn btn-cancel"
              >
                <FaTimes style={{ marginRight: "8px" }} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
