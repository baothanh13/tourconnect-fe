import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import Loading from "../Loading";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaEye } from "react-icons/fa";
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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(filters);
      setUsers(data.users || data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await adminService.updateUserStatus(userId, newStatus);
      alert(`User status updated to ${newStatus}`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status");
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
        <h2>User Management</h2>
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
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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
                      onClick={() =>
                        handleStatusUpdate(
                          user.id,
                          user.is_active ? "inactive" : "active"
                        )
                      }
                      className={`btn-status ${
                        user.is_active ? "deactivate" : "activate"
                      }`}
                      title={user.is_active ? "Deactivate" : "Activate"}
                    >
                      <FaEdit />
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
                className={`btn ${
                  selectedUser.is_active ? "btn-danger" : "btn-success"
                }`}
              >
                {selectedUser.is_active ? "Deactivate" : "Activate"}
              </button>
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

export default UserManagement;
