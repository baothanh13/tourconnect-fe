import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { adminService } from "../services/adminService";
import { guidesService } from "../services/guidesService";
import { bookingsService } from "../services/bookingsService";
import { usersService } from "../services/usersService";
import "./SupportDashboard.css";
import Loading from "../components/Loading";
import "./SupportDashboard.css";

const SupportDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [supportTickets, setSupportTickets] = useState([]);
  const [pendingGuides, setPendingGuides] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [flaggedTours, setFlaggedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedToday: 0,
    averageResponseTime: 2.5,
    pendingVerifications: 0,
    pendingRefunds: 0,
    flaggedContent: 0,
  });

  useEffect(() => {
    if (user && (user.userType === "support" || user.role === "support")) {
      loadSupportData();
    }
  }, [user]);

  const loadSupportData = async () => {
    try {
      setLoading(true);

      // Load support tickets (mock data for now)
      const mockTickets = [
        {
          id: 1,
          type: "booking_issue",
          priority: "high",
          status: "open",
          subject: "Payment failed for booking #123",
          customer: "Mai Nguyen",
          customerEmail: "mai@example.com",
          assignedTo: user.name,
          createdAt: "2025-08-01T09:30:00Z",
          lastUpdate: "2025-08-01T10:15:00Z",
          description:
            "Customer unable to complete payment for Hanoi city tour.",
          bookingId: "TC-2024-001",
        },
        {
          id: 2,
          type: "guide_complaint",
          priority: "medium",
          status: "in_progress",
          subject: "Guide did not show up",
          customer: "John Smith",
          customerEmail: "john@example.com",
          assignedTo: user.name,
          createdAt: "2025-08-01T08:45:00Z",
          lastUpdate: "2025-08-01T11:20:00Z",
          description:
            "Tourist reported that guide did not arrive at meeting point.",
          guideId: 2,
        },
        {
          id: 3,
          type: "refund_request",
          priority: "medium",
          status: "pending",
          subject: "Refund request for cancelled tour",
          customer: "Emma Wilson",
          customerEmail: "emma@example.com",
          assignedTo: null,
          createdAt: "2025-08-01T07:15:00Z",
          lastUpdate: "2025-08-01T07:15:00Z",
          description:
            "Customer requests refund for tour cancelled due to weather.",
          refundAmount: 75,
          bookingId: "TC-2024-003",
        },
      ];
      setSupportTickets(mockTickets);

      // Load pending guide verifications
      const guides = await guidesService.getAllGuides();
      const pendingVerifications = guides.filter((guide) => !guide.isVerified);
      setPendingGuides(pendingVerifications);

      // Load refund requests
      const refunds = [
        {
          id: 1,
          bookingId: "TC-2024-003",
          touristName: "Emma Wilson",
          guideName: "Marie Dubois",
          amount: 75,
          reason: "Weather cancellation",
          requestDate: "2025-08-01T07:15:00Z",
          status: "pending",
          type: "full_refund",
        },
        {
          id: 2,
          bookingId: "TC-2024-004",
          touristName: "David Kim",
          guideName: "Carlos Rodriguez",
          amount: 32.5,
          reason: "Service quality issue",
          requestDate: "2025-07-31T14:30:00Z",
          status: "approved",
          type: "partial_refund",
        },
      ];
      setRefundRequests(refunds);

      // Load flagged tours/content
      const flagged = [
        {
          id: 1,
          type: "inappropriate_content",
          tourTitle: "Suspicious Tour Package",
          guideName: "Unknown Guide",
          reason: "Misleading information",
          reportedBy: "System",
          reportedAt: "2025-08-01T06:00:00Z",
          status: "under_review",
        },
      ];
      setFlaggedTours(flagged);

      // Calculate stats
      setStats({
        openTickets: mockTickets.filter((t) => t.status === "open").length,
        resolvedToday: 5,
        averageResponseTime: 2.5,
        pendingVerifications: pendingVerifications.length,
        pendingRefunds: refunds.filter((r) => r.status === "pending").length,
        flaggedContent: flagged.filter((f) => f.status === "under_review")
          .length,
      });
    } catch (error) {
      console.error("Error loading support data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyGuide = async (guideId, action) => {
    try {
      setLoading(true);
      if (action === "approve") {
        await adminService.verifyGuide(guideId);
        alert("Guide approved successfully!");
      } else {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason) {
          console.log(`Rejecting guide ${guideId}: ${reason}`);
          alert("Guide rejected.");
        }
      }
      loadSupportData(); // Reload data
    } catch (error) {
      alert("Error processing guide verification: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async (refundId, action) => {
    try {
      setLoading(true);
      if (action === "approve") {
        console.log(`Approving refund ${refundId}`);
        alert("Refund approved and processed!");
      } else {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason) {
          console.log(`Rejecting refund ${refundId}: ${reason}`);
          alert("Refund rejected.");
        }
      }
      loadSupportData(); // Reload data
    } catch (error) {
      alert("Error processing refund: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketUpdate = async (ticketId, status) => {
    try {
      setLoading(true);
      // Update ticket status
      setSupportTickets((tickets) =>
        tickets.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status, lastUpdate: new Date().toISOString() }
            : ticket
        )
      );
      alert(`Ticket ${status} successfully!`);
    } catch (error) {
      alert("Error updating ticket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFlaggedContent = async (contentId, action) => {
    try {
      setLoading(true);
      if (action === "remove") {
        console.log(`Removing flagged content ${contentId}`);
        alert("Content removed successfully!");
      } else if (action === "approve") {
        console.log(`Approving flagged content ${contentId}`);
        alert("Content approved and restored!");
      }
      loadSupportData(); // Reload data
    } catch (error) {
      alert("Error handling flagged content: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketAction = async (ticketId, status) => {
    try {
      setLoading(true);
      console.log(`Updating ticket ${ticketId} to status: ${status}`);

      // Update ticket status in local state
      setSupportTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );

      alert(
        `Ticket ${status === "in_progress" ? "assigned" : status} successfully!`
      );

      loadSupportData(); // Reload data
    } catch (error) {
      alert("Error updating ticket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading size="large" text="Loading support dashboard..." overlay />;
  }

  return (
    <div className="support-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="support-welcome">
            <div className="support-icon">🛠️</div>
            <div className="welcome-text">
              <h1>Support Dashboard</h1>
              <p>Help users and guides have the best experience</p>
            </div>
          </div>

          <div className="quick-stats">
            <div className="stat-card urgent">
              <div className="stat-number">{stats.openTickets}</div>
              <div className="stat-label">Open Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingVerifications}</div>
              <div className="stat-label">Pending Verifications</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pendingRefunds}</div>
              <div className="stat-label">Pending Refunds</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.flaggedContent}</div>
              <div className="stat-label">Flagged Content</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        <button
          className={activeTab === "overview" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === "tickets" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("tickets")}
        >
          🎫 Support Tickets
        </button>
        <button
          className={
            activeTab === "verification" ? "nav-btn active" : "nav-btn"
          }
          onClick={() => setActiveTab("verification")}
        >
          ✅ Guide Verification
        </button>
        <button
          className={activeTab === "refunds" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("refunds")}
        >
          💰 Refund Management
        </button>
        <button
          className={activeTab === "content" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("content")}
        >
          🚩 Content Moderation
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📈 Support Statistics</h3>
                <div className="stats-list">
                  <div className="stat-item">
                    <span>Open Tickets:</span>
                    <span className="urgent">{stats.openTickets}</span>
                  </div>
                  <div className="stat-item">
                    <span>Resolved Today:</span>
                    <span>{stats.resolvedToday}</span>
                  </div>
                  <div className="stat-item">
                    <span>Avg Response Time:</span>
                    <span>{stats.averageResponseTime}h</span>
                  </div>
                  <div className="stat-item">
                    <span>Pending Verifications:</span>
                    <span>{stats.pendingVerifications}</span>
                  </div>
                  <div className="stat-item">
                    <span>Pending Refunds:</span>
                    <span>{stats.pendingRefunds}</span>
                  </div>
                  <div className="stat-item">
                    <span>Flagged Content:</span>
                    <span>{stats.flaggedContent}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>🚨 Urgent Actions Required</h3>
                <div className="urgent-actions">
                  {stats.openTickets > 0 && (
                    <div className="urgent-item">
                      <span className="urgent-icon">🎫</span>
                      <span>
                        {stats.openTickets} open tickets need attention
                      </span>
                      <button
                        className="btn-small btn-primary"
                        onClick={() => setActiveTab("tickets")}
                      >
                        Review
                      </button>
                    </div>
                  )}
                  {stats.pendingVerifications > 0 && (
                    <div className="urgent-item">
                      <span className="urgent-icon">✅</span>
                      <span>
                        {stats.pendingVerifications} guides awaiting
                        verification
                      </span>
                      <button
                        className="btn-small btn-primary"
                        onClick={() => setActiveTab("verification")}
                      >
                        Review
                      </button>
                    </div>
                  )}
                  {stats.pendingRefunds > 0 && (
                    <div className="urgent-item">
                      <span className="urgent-icon">💰</span>
                      <span>
                        {stats.pendingRefunds} refund requests pending
                      </span>
                      <button
                        className="btn-small btn-primary"
                        onClick={() => setActiveTab("refunds")}
                      >
                        Process
                      </button>
                    </div>
                  )}
                  {stats.flaggedContent > 0 && (
                    <div className="urgent-item">
                      <span className="urgent-icon">🚩</span>
                      <span>
                        {stats.flaggedContent} content reports to review
                      </span>
                      <button
                        className="btn-small btn-primary"
                        onClick={() => setActiveTab("content")}
                      >
                        Moderate
                      </button>
                    </div>
                  )}
                  {stats.openTickets === 0 &&
                    stats.pendingVerifications === 0 &&
                    stats.pendingRefunds === 0 &&
                    stats.flaggedContent === 0 && (
                      <div className="no-urgent">
                        <span>
                          🎉 All caught up! No urgent actions required.
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <div className="overview-card">
                <h3>📋 Recent Activity</h3>
                <div className="recent-activity">
                  <div className="activity-item">
                    <span className="activity-time">2 hours ago</span>
                    <span>Verified guide: Carlos Rodriguez</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">4 hours ago</span>
                    <span>Processed refund: $75.00</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-time">6 hours ago</span>
                    <span>Resolved ticket: Payment issue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="tickets-section">
            <div className="section-header">
              <h2>Support Tickets</h2>
              <div className="ticket-filters">
                <select>
                  <option>All Tickets</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <select>
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="tickets-grid">
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`ticket-card priority-${ticket.priority}`}
                >
                  <div className="ticket-header">
                    <div className="ticket-id">#{ticket.id}</div>
                    <div className={`ticket-status ${ticket.status}`}>
                      {ticket.status.replace("_", " ").toUpperCase()}
                    </div>
                    <div
                      className={`ticket-priority priority-${ticket.priority}`}
                    >
                      {ticket.priority.toUpperCase()}
                    </div>
                  </div>

                  <div className="ticket-content">
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.description}</p>

                    <div className="ticket-details">
                      <div className="detail-row">
                        <span>👤 Customer:</span>
                        <span>
                          {ticket.customer} ({ticket.customerEmail})
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>📂 Type:</span>
                        <span>{ticket.type.replace("_", " ")}</span>
                      </div>
                      <div className="detail-row">
                        <span>👨‍💼 Assigned:</span>
                        <span>{ticket.assignedTo || "Unassigned"}</span>
                      </div>
                      <div className="detail-row">
                        <span>📅 Created:</span>
                        <span>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span>🔄 Updated:</span>
                        <span>
                          {new Date(ticket.lastUpdate).toLocaleDateString()}
                        </span>
                      </div>
                      {ticket.bookingId && (
                        <div className="detail-row">
                          <span>🎫 Booking:</span>
                          <span>{ticket.bookingId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ticket-actions">
                    {ticket.status === "open" && (
                      <>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleTicketUpdate(ticket.id, "in_progress")
                          }
                        >
                          Take Action
                        </button>
                        <button className="btn btn-secondary">
                          Contact Customer
                        </button>
                      </>
                    )}
                    {ticket.status === "in_progress" && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleTicketUpdate(ticket.id, "resolved")
                          }
                        >
                          Mark Resolved
                        </button>
                        <button className="btn btn-secondary">Add Note</button>
                      </>
                    )}
                    <button className="btn btn-info">View Details</button>
                  </div>
                </div>
              ))}

              {supportTickets.length === 0 && (
                <div className="no-tickets">
                  <h3>No support tickets</h3>
                  <p>All customers are happy! 🎉</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "verification" && (
          <div className="verification-section">
            <div className="section-header">
              <h2>Guide Verification</h2>
              <p>Review and verify new guide applications</p>
            </div>

            <div className="verification-grid">
              {pendingGuides.map((guide) => (
                <div key={guide.id} className="verification-card">
                  <div className="guide-profile">
                    <div className="guide-avatar">
                      {guide.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="guide-info">
                      <h3>{guide.name}</h3>
                      <p>{guide.email}</p>
                      <p>{guide.location}</p>
                      <div className="application-date">
                        Applied:{" "}
                        {new Date(guide.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="guide-details">
                    <div className="detail-section">
                      <h4>Experience</h4>
                      <p>5+ years in tourism industry</p>
                    </div>

                    <div className="detail-section">
                      <h4>Languages</h4>
                      <p>Vietnamese, English, Chinese</p>
                    </div>

                    <div className="detail-section">
                      <h4>Specialties</h4>
                      <p>Cultural Tours, Food Tours, Historical Sites</p>
                    </div>

                    <div className="detail-section">
                      <h4>Documents</h4>
                      <div className="documents-list">
                        <span className="document">✅ ID Verification</span>
                        <span className="document">✅ Tourism License</span>
                        <span className="document">✅ Background Check</span>
                      </div>
                    </div>
                  </div>

                  <div className="verification-actions">
                    <button
                      className="btn btn-success"
                      onClick={() => handleVerifyGuide(guide.id, "approve")}
                    >
                      ✅ Approve Guide
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleVerifyGuide(guide.id, "reject")}
                    >
                      ❌ Reject
                    </button>
                    <button className="btn btn-secondary">
                      📄 View Documents
                    </button>
                  </div>
                </div>
              ))}

              {pendingGuides.length === 0 && (
                <div className="no-pending">
                  <h3>No pending verifications</h3>
                  <p>All guides are up to date! ✅</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "refunds" && (
          <div className="refunds-section">
            <div className="section-header">
              <h2>Refund Management</h2>
              <div className="refund-filters">
                <select>
                  <option>All Refunds</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>

            <div className="refunds-grid">
              {refundRequests.map((refund) => (
                <div key={refund.id} className="refund-card">
                  <div className="refund-header">
                    <div className="refund-id">Refund #{refund.id}</div>
                    <div className={`refund-status ${refund.status}`}>
                      {refund.status.toUpperCase()}
                    </div>
                    <div className="refund-amount">${refund.amount}</div>
                  </div>

                  <div className="refund-details">
                    <div className="detail-row">
                      <span>🎫 Booking:</span>
                      <span>{refund.bookingId}</span>
                    </div>
                    <div className="detail-row">
                      <span>👤 Tourist:</span>
                      <span>{refund.touristName}</span>
                    </div>
                    <div className="detail-row">
                      <span>🧭 Guide:</span>
                      <span>{refund.guideName}</span>
                    </div>
                    <div className="detail-row">
                      <span>📝 Reason:</span>
                      <span>{refund.reason}</span>
                    </div>
                    <div className="detail-row">
                      <span>📅 Requested:</span>
                      <span>
                        {new Date(refund.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>🔄 Type:</span>
                      <span>{refund.type.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div className="refund-actions">
                    {refund.status === "pending" && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() =>
                            handleRefundRequest(refund.id, "approve")
                          }
                        >
                          ✅ Approve Refund
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleRefundRequest(refund.id, "reject")
                          }
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                    <button className="btn btn-info">
                      📄 View Booking Details
                    </button>
                  </div>
                </div>
              ))}

              {refundRequests.length === 0 && (
                <div className="no-refunds">
                  <h3>No refund requests</h3>
                  <p>No refund requests to process.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="content-section">
            <div className="section-header">
              <h2>Content Moderation</h2>
              <p>Review flagged tours and inappropriate content</p>
            </div>

            <div className="content-grid">
              {flaggedTours.map((item) => (
                <div key={item.id} className="content-card">
                  <div className="content-header">
                    <div className="flag-icon">🚩</div>
                    <div className="content-type">
                      {item.type.replace("_", " ")}
                    </div>
                    <div className={`content-status ${item.status}`}>
                      {item.status.replace("_", " ").toUpperCase()}
                    </div>
                  </div>

                  <div className="content-details">
                    <h3>{item.tourTitle}</h3>
                    <div className="detail-row">
                      <span>🧭 Guide:</span>
                      <span>{item.guideName}</span>
                    </div>
                    <div className="detail-row">
                      <span>📝 Reason:</span>
                      <span>{item.reason}</span>
                    </div>
                    <div className="detail-row">
                      <span>👤 Reported by:</span>
                      <span>{item.reportedBy}</span>
                    </div>
                    <div className="detail-row">
                      <span>📅 Reported:</span>
                      <span>
                        {new Date(item.reportedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="content-actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleFlaggedContent(item.id, "remove")}
                    >
                      🗑️ Remove Content
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleFlaggedContent(item.id, "approve")}
                    >
                      ✅ Approve Content
                    </button>
                    <button className="btn btn-secondary">
                      👁️ View Full Content
                    </button>
                  </div>
                </div>
              ))}

              {flaggedTours.length === 0 && (
                <div className="no-flagged">
                  <h3>No flagged content</h3>
                  <p>All content is appropriate! 🎉</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="support-tickets">
      <div className="tickets-header">
        <h3>Support Tickets</h3>
        <div className="ticket-filters">
          <select className="filter-select">
            <option value="all">All Tickets</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select className="filter-select">
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      <div className="tickets-table">
        <div className="table-header">
          <span>Ticket ID</span>
          <span>Subject</span>
          <span>Customer</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Assigned To</span>
          <span>Actions</span>
        </div>

        {supportTickets.map((ticket) => (
          <div key={ticket.id} className="ticket-row">
            <span className="ticket-id">#{ticket.id}</span>
            <div className="ticket-subject">
              <h4>{ticket.subject}</h4>
              <p>{ticket.description}</p>
            </div>
            <div className="customer-info">
              <span className="customer-name">{ticket.customer}</span>
              <span className="customer-email">{ticket.customerEmail}</span>
            </div>
            <span className={`priority ${ticket.priority}`}>
              {ticket.priority.toUpperCase()}
            </span>
            <span className={`ticket-status ${ticket.status}`}>
              {ticket.status.replace("_", " ").toUpperCase()}
            </span>
            <span className="assigned-to">{ticket.assignedTo}</span>
            <div className="ticket-actions">
              {ticket.status === "open" && (
                <button
                  onClick={() => handleTicketAction(ticket.id, "in_progress")}
                  className="btn-assign"
                >
                  Take
                </button>
              )}
              {ticket.status === "in_progress" && (
                <button
                  onClick={() => handleTicketAction(ticket.id, "resolved")}
                  className="btn-resolve"
                >
                  Resolve
                </button>
              )}
              <button className="btn-view">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLiveChat = () => (
    <div className="live-chat">
      <div className="chat-header">
        <h3>Live Chat Support</h3>
        <div className="chat-stats">
          <span className="active-chats">{stats.activeChats} active chats</span>
        </div>
      </div>

      <div className="chat-sessions">
        <div className="chat-session">
          <div className="chat-user">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <h4>Tourist User</h4>
              <p>Asking about tour availability</p>
            </div>
          </div>
          <div className="chat-actions">
            <button className="btn-join">Join Chat</button>
            <button className="btn-transfer">Transfer</button>
          </div>
        </div>

        <div className="chat-session">
          <div className="chat-user">
            <div className="user-avatar">🧑‍💼</div>
            <div className="user-info">
              <h4>Guide User</h4>
              <p>Technical issue with dashboard</p>
            </div>
          </div>
          <div className="chat-actions">
            <button className="btn-join">Join Chat</button>
            <button className="btn-transfer">Transfer</button>
          </div>
        </div>

        <div className="chat-session">
          <div className="chat-user">
            <div className="user-avatar">✈️</div>
            <div className="user-info">
              <h4>International Tourist</h4>
              <p>Payment processing help needed</p>
            </div>
          </div>
          <div className="chat-actions">
            <button className="btn-join">Join Chat</button>
            <button className="btn-transfer">Transfer</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div className="knowledge-base">
      <div className="kb-header">
        <h3>Knowledge Base</h3>
        <button className="btn-primary">Add New Article</button>
      </div>

      <div className="kb-categories">
        <div className="kb-category">
          <h4>🎫 Booking Issues</h4>
          <ul>
            <li>
              <a href="#payment">Payment Processing Problems</a>
            </li>
            <li>
              <a href="#cancellation">Cancellation & Refund Policy</a>
            </li>
            <li>
              <a href="#modification">Booking Modifications</a>
            </li>
            <li>
              <a href="#confirmation">Booking Confirmation Issues</a>
            </li>
          </ul>
        </div>

        <div className="kb-category">
          <h4>👨‍🏫 Guide Related</h4>
          <ul>
            <li>
              <a href="#no-show">Guide No-Show Protocol</a>
            </li>
            <li>
              <a href="#quality">Tour Quality Complaints</a>
            </li>
            <li>
              <a href="#communication">Communication Issues</a>
            </li>
            <li>
              <a href="#verification">Guide Verification Process</a>
            </li>
          </ul>
        </div>

        <div className="kb-category">
          <h4>💻 Technical Support</h4>
          <ul>
            <li>
              <a href="#app-issues">Mobile App Problems</a>
            </li>
            <li>
              <a href="#login">Login & Account Issues</a>
            </li>
            <li>
              <a href="#notifications">Notification Settings</a>
            </li>
            <li>
              <a href="#browser">Browser Compatibility</a>
            </li>
          </ul>
        </div>

        <div className="kb-category">
          <h4>💰 Financial</h4>
          <ul>
            <li>
              <a href="#refunds">Refund Processing</a>
            </li>
            <li>
              <a href="#disputes">Payment Disputes</a>
            </li>
            <li>
              <a href="#fees">Service Fees Explanation</a>
            </li>
            <li>
              <a href="#currencies">Multi-Currency Support</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="support-reports">
      <div className="reports-header">
        <h3>Support Reports & Analytics</h3>
      </div>

      <div className="report-sections">
        <div className="report-card">
          <h4>📊 Performance Metrics</h4>
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-value">2.5h</span>
              <span className="metric-label">Avg Response Time</span>
            </div>
            <div className="metric">
              <span className="metric-value">87%</span>
              <span className="metric-label">First Contact Resolution</span>
            </div>
            <div className="metric">
              <span className="metric-value">4.6/5</span>
              <span className="metric-label">Customer Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h4>📈 Ticket Trends</h4>
          <div className="trend-chart">
            <p>• Booking issues: 35% (↑5%)</p>
            <p>• Payment problems: 25% (↓2%)</p>
            <p>• Guide complaints: 20% (↑3%)</p>
            <p>• Technical support: 15% (↑1%)</p>
            <p>• General inquiries: 5% (↓2%)</p>
          </div>
        </div>

        <div className="report-card">
          <h4>👥 Team Performance</h4>
          <div className="team-stats">
            <div className="team-member">
              <span>Sarah Wilson</span>
              <span>24 tickets resolved</span>
            </div>
            <div className="team-member">
              <span>Mike Chen</span>
              <span>18 tickets resolved</span>
            </div>
            <div className="team-member">
              <span>Tech Support</span>
              <span>12 tickets resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user || user.userType !== "support") {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>This dashboard is only accessible to support staff.</p>
      </div>
    );
  }

  return (
    <div className="support-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Support Dashboard</h1>
          <p>Customer Support & Service Management</p>
        </div>

        {/* Stats Overview */}
        <div className="support-stats">
          <div className="stat-card urgent">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <h3>{stats.openTickets}</h3>
              <p>Open Tickets</p>
            </div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.resolvedToday}</h3>
              <p>Resolved Today</p>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3>{stats.averageResponseTime}h</h3>
              <p>Avg Response Time</p>
            </div>
          </div>
          <div className="stat-card rating">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{stats.customerSatisfaction}/5</h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>
          <div className="stat-card chat">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <h3>{stats.activeChats}</h3>
              <p>Active Chats</p>
            </div>
          </div>
        </div>

        <div className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            🎫 Support Tickets
          </button>
          <button
            className={`nav-tab ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            💬 Live Chat
          </button>
          <button
            className={`nav-tab ${activeTab === "knowledge" ? "active" : ""}`}
            onClick={() => setActiveTab("knowledge")}
          >
            📚 Knowledge Base
          </button>
          <button
            className={`nav-tab ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            📊 Reports
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "tickets" && renderTickets()}
          {activeTab === "chat" && renderLiveChat()}
          {activeTab === "knowledge" && renderKnowledgeBase()}
          {activeTab === "reports" && renderReports()}
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
