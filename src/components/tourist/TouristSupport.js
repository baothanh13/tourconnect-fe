import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supportService } from "../../services/supportService";
import Loading from "../Loading";
import {
  FaTicketAlt,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaArrowLeft,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import "./TouristSupport.css";

const TouristSupport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    support_type: user?.role === "guide" ? "guide" : "tourist",
    email: "",
    phone: "",
  });

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Get tickets for current user using getTicketByUserId API
      const ticketsData = await supportService.getTicketsByUserId(user.id);
      setTickets(ticketsData);
    } catch (err) {
      setError("Failed to load support tickets. Please try again.");
      console.error("Error loading tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      // Backend will automatically get user_id from auth token
      const ticketData = {
        ...newTicket,
      };

      await supportService.createTicket(ticketData);
      setShowCreateModal(false);
      setNewTicket({
        subject: "",
        message: "",
        support_type: user?.role === "guide" ? "guide" : "tourist",
        email: "",
        phone: "",
      });
      loadTickets();
    } catch (err) {
      setError("Failed to create support ticket. Please try again.");
      console.error("Error creating ticket:", err);
    }
  };

  const handleEditTicket = async (e) => {
    e.preventDefault();
    try {
      await supportService.updateTicket(selectedTicket.id, {
        subject: selectedTicket.subject,
        message: selectedTicket.message,
      });
      setShowEditModal(false);
      setSelectedTicket(null);
      loadTickets();
    } catch (err) {
      setError("Failed to update support ticket. Please try again.");
      console.error("Error updating ticket:", err);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this support ticket?")) {
      return;
    }

    try {
      await supportService.deleteTicket(ticketId);
      loadTickets();
    } catch (err) {
      setError("Failed to delete support ticket. Please try again.");
      console.error("Error deleting ticket:", err);
    }
  };

  const openEditModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "warning";
      case "in_progress":
        return "info";
      case "resolved":
        return "success";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <FaClock />;
      case "in_progress":
        return <FaSpinner />;
      case "resolved":
        return <FaCheckCircle />;
      case "closed":
        return <FaTimes />;
      default:
        return <FaClock />;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loading />;

  return (
    <div className="tourist-support">
      {/* Header with back button and title */}
      <div className="page-header">
        <button
          className="back-button"
          onClick={() => navigate(user?.role === "guide" ? "/guide/dashboard" : "/tourist/dashboard")}
        >
          <FaArrowLeft />
        </button>
        <div className="page-title-center">
          <h2>Support Center</h2>
          <p>Get help and manage your support tickets</p>
        </div>
        <button
          className="btn-primary add-ticket-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus /> Create Ticket
        </button>
      </div>

      {/* Statistics Cards - 2x2 Grid */}
      <div className="support-stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <FaTicketAlt />
          </div>
          <div className="stat-content">
            <div className="stat-number">{tickets.length}</div>
            <div className="stat-label">TOTAL TICKETS</div>
          </div>
        </div>

        <div className="stat-card open">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {tickets.filter((t) => t.status === "open").length}
            </div>
            <div className="stat-label">OPEN TICKETS</div>
          </div>
        </div>

        <div className="stat-card resolved">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
            <div className="stat-label">RESOLVED</div>
          </div>
        </div>

        <div className="stat-card recent">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {
                tickets.filter((t) => {
                  const ticketDate = new Date(t.created_at);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return ticketDate >= thirtyDaysAgo;
                }).length
              }
            </div>
            <div className="stat-label">RECENT TICKETS</div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h3>SEARCH TICKETS</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by subject or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>FILTER BY STATUS</h3>
        <div className="filter-tabs">
          <button
            className={filterStatus === "all" ? "active" : ""}
            onClick={() => setFilterStatus("all")}
          >
            All Status
          </button>
          <button
            className={filterStatus === "open" ? "active" : ""}
            onClick={() => setFilterStatus("open")}
          >
            Open
          </button>
          <button
            className={filterStatus === "in_progress" ? "active" : ""}
            onClick={() => setFilterStatus("in_progress")}
          >
            In Progress
          </button>
          <button
            className={filterStatus === "resolved" ? "active" : ""}
            onClick={() => setFilterStatus("resolved")}
          >
            Resolved
          </button>
          <button
            className={filterStatus === "closed" ? "active" : ""}
            onClick={() => setFilterStatus("closed")}
          >
            Closed
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle />
          <span>{error}</span>
          <button onClick={loadTickets}>Retry</button>
        </div>
      )}

      {/* Tickets List */}
      <div className="tickets-list">
        {filteredTickets.length === 0 ? (
          <div className="no-tickets">
            <FaTicketAlt className="no-tickets-icon" />
            <h3>No support tickets found</h3>
            <p>
              {searchQuery || filterStatus !== "all"
                ? "No tickets match your current filters."
                : "You haven't created any support tickets yet."}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-info">
                  <h4>{ticket.subject}</h4>
                  <p className="ticket-type">
                    <FaUser /> Type: {ticket.support_type}
                  </p>
                  <div className={`ticket-status ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span>{ticket.status.replace("_", " ").toUpperCase()}</span>
                  </div>
                </div>
                <div className="ticket-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => openEditModal(ticket)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteTicket(ticket.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="ticket-content">
                <p>{ticket.message}</p>
              </div>

              <div className="ticket-footer">
                <span className="ticket-date">
                  <FaCalendarAlt />{" "}
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
                {ticket.email && (
                  <span className="ticket-email">
                    <FaUser /> {ticket.email}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Support Ticket</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, message: e.target.value })
                  }
                  placeholder="Describe your issue in detail..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label>Support Type *</label>
                <select
                  value={newTicket.support_type}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, support_type: e.target.value })
                  }
                  required
                >
                  <option value="tourist">Tourist Support</option>
                  <option value="guide">Guide Support</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  value={newTicket.email}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, email: e.target.value })
                  }
                  placeholder="Your email address"
                />
              </div>

              <div className="form-group">
                <label>Phone (Optional)</label>
                <input
                  type="tel"
                  value={newTicket.phone}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, phone: e.target.value })
                  }
                  placeholder="Your phone number"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Support Ticket</h3>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleEditTicket}>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={selectedTicket.subject}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={selectedTicket.message}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      message: e.target.value,
                    })
                  }
                  placeholder="Describe your issue in detail..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristSupport;
