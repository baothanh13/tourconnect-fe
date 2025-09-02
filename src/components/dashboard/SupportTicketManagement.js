import React, { useState, useEffect, useCallback } from "react";
import { supportService } from "../../services/supportService";
import Loading from "../Loading";
import {
  FaEye,
  FaTrash,
  FaCheck,
  FaClock,
  FaUser,
  FaUserTie,
  FaTicketAlt,
  FaReply,
} from "react-icons/fa";
import "./SupportTicketManagement.css";

const SupportTicketManagement = ({ onTicketUpdate = () => {} }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    support_type: "",
    q: "",
    page: 1,
    limit: 10,
    sort: "created_at",
    order: "desc",
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await supportService.getAllTickets(filters);
      const rows = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setTickets(rows);
    } catch (error) {
      alert("Failed to fetch support tickets");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      await supportService.updateTicketStatus(ticketId, newStatus);
      alert(`Ticket status updated to ${newStatus}`);
      fetchTickets(); // Refresh the list
      // Refresh dashboard data to update stats
      if (onTicketUpdate) {
        onTicketUpdate();
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Failed to update ticket status");
    }
  };

  const handleAddResponse = async (ticketId) => {
    if (!responseText.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      await supportService.addResponse(ticketId, responseText);
      alert("Response added successfully");
      setResponseText("");
      setShowModal(false);
      fetchTickets(); // Refresh the list
      // Refresh dashboard data to update stats
      if (onTicketUpdate) {
        onTicketUpdate();
      }
    } catch (error) {
      console.error("Error adding response:", error);
      alert("Failed to add response");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await supportService.deleteTicket(ticketId);
        alert("Ticket deleted successfully");
        fetchTickets(); // Refresh the list
        // Refresh dashboard data to update stats
        if (onTicketUpdate) {
          onTicketUpdate();
        }
      } catch (error) {
        alert("Failed to delete ticket");
      }
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "danger";
      case "pending":
        return "warning";
      case "resolved":
        return "success";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type) => {
    return type === "guide" ? <FaUserTie /> : <FaUser />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="support-ticket-management">
      <div className="ticket-management-header">
        <h2>Support Ticket Management</h2>
        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.support_type}
            onChange={(e) =>
              setFilters({ ...filters, support_type: e.target.value })
            }
          >
            <option value="">All Types</option>
            <option value="user">User</option>
            <option value="guide">Guide</option>
          </select>
          <input
            type="text"
            placeholder="Search tickets..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="search-input"
          />
        </div>
      </div>

      <div className="tickets-table">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Type</th>
              <th>Subject</th>
              <th>User</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <div className="ticket-id">
                    <FaTicketAlt />#{ticket.id}
                  </div>
                </td>
                <td>
                  <div className="ticket-type">
                    {getTypeIcon(ticket.support_type)}
                    <span>{ticket.support_type}</span>
                  </div>
                </td>
                <td>
                  <div className="ticket-subject">
                    <strong>{ticket.subject}</strong>
                    <p>{ticket.message?.substring(0, 60)}...</p>
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <span>{ticket.email}</span>
                    {ticket.phone && <small>{ticket.phone}</small>}
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <span className="priority-badge high">High</span>
                </td>
                <td>{formatDate(ticket.created_at)}</td>
                <td>
                  {ticket.updated_at ? formatDate(ticket.updated_at) : "N/A"}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleViewTicket(ticket)}
                      className="btn-view"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {ticket.status !== "closed" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(ticket.id, "pending")
                          }
                          className="btn-progress"
                          title="Mark In Progress"
                          disabled={ticket.status === "pending"}
                        >
                          <FaClock />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(ticket.id, "resolved")
                          }
                          className="btn-resolve"
                          title="Mark Resolved"
                          disabled={ticket.status === "resolved"}
                        >
                          <FaCheck />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTicket(ticket.id)}
                      className="btn-delete"
                      title="Delete Ticket"
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

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ticket Details - #{selectedTicket.id}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="ticket-section">
                <h4>Ticket Information</h4>
                <div className="ticket-detail-item">
                  <strong>ID:</strong> #{selectedTicket.id}
                </div>
                <div className="ticket-detail-item">
                  <strong>Type:</strong> {selectedTicket.support_type}
                </div>
                <div className="ticket-detail-item">
                  <strong>Subject:</strong> {selectedTicket.subject}
                </div>
                <div className="ticket-detail-item">
                  <strong>Status:</strong>
                  <span
                    className={`status-badge ${getStatusColor(
                      selectedTicket.status
                    )}`}
                  >
                    {selectedTicket.status}
                  </span>
                </div>
                <div className="ticket-detail-item">
                  <strong>Message:</strong>
                  <p className="ticket-message">{selectedTicket.message}</p>
                </div>
              </div>

              <div className="ticket-section">
                <h4>User Information</h4>
                <div className="ticket-detail-item">
                  <strong>User ID:</strong> {selectedTicket.user_id || "N/A"}
                </div>
                <div className="ticket-detail-item">
                  <strong>Email:</strong> {selectedTicket.email}
                </div>
                <div className="ticket-detail-item">
                  <strong>Phone:</strong> {selectedTicket.phone || "N/A"}
                </div>
              </div>

              <div className="ticket-section">
                <h4>Support Response</h4>
                {selectedTicket.response ? (
                  <div className="existing-response">
                    <p>{selectedTicket.response}</p>
                    <small>
                      Assigned to:{" "}
                      {selectedTicket.assigned_staff || "Unassigned"}
                    </small>
                  </div>
                ) : (
                  <div className="response-form">
                    <textarea
                      placeholder="Enter your response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                      className="response-textarea"
                    />
                    <button
                      onClick={() => handleAddResponse(selectedTicket.id)}
                      className="btn-submit-response"
                    >
                      <FaReply />
                      Send Response
                    </button>
                  </div>
                )}
              </div>

              <div className="ticket-section">
                <h4>Timestamps</h4>
                <div className="ticket-detail-item">
                  <strong>Created:</strong>{" "}
                  {formatDate(selectedTicket.created_at)}
                </div>
                <div className="ticket-detail-item">
                  <strong>Last Updated:</strong>{" "}
                  {selectedTicket.updated_at
                    ? formatDate(selectedTicket.updated_at)
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedTicket.status !== "closed" && (
                <>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTicket.id, "pending");
                      setShowModal(false);
                    }}
                    className="btn btn-warning"
                    disabled={selectedTicket.status === "pending"}
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedTicket.id, "resolved");
                      setShowModal(false);
                    }}
                    className="btn btn-success"
                    disabled={selectedTicket.status === "resolved"}
                  >
                    Mark Resolved
                  </button>
                </>
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

export default SupportTicketManagement;
