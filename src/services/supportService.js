import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tourconnect_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const supportService = {
  // Get all support tickets
  async getAllTickets(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.support_type)
        params.append("support_type", filters.support_type);
      if (filters.q) params.append("q", filters.q);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.order) params.append("order", filters.order);

      const queryString = params.toString();
      const url = queryString
        ? `/supportTickets?${queryString}`
        : "/supportTickets";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch support tickets."
      );
    }
  },

  // Get support tickets by user ID
  async getTicketsByUserId(userId) {
    try {
      const response = await apiClient.get(`/supportTickets/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user support tickets:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user support tickets."
      );
    }
  },

  // Get support ticket by ID
  async getTicketById(ticketId) {
    try {
      const response = await apiClient.get(`/supportTickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching support ticket:", error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch support ticket details."
      );
    }
  },

  // Create new support ticket
  async createTicket(ticketData) {
    try {
      // Remove user_id from ticketData since backend will get it from auth token
      const { user_id, ...ticketDataWithoutUserId } = ticketData;
      
      const response = await apiClient.post("/supportTickets", ticketDataWithoutUserId);
      return response.data;
    } catch (error) {
      console.error("Error creating support ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create support ticket."
      );
    }
  },

  // Update support ticket
  async updateTicket(ticketId, updateData) {
    try {
      const response = await apiClient.put(`/supportTickets/${ticketId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating support ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update support ticket."
      );
    }
  },

  // Delete support ticket
  async deleteTicket(ticketId) {
    try {
      const response = await apiClient.delete(`/supportTickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting support ticket:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete support ticket."
      );
    }
  },

  // Get support statistics
  async getSupportStats() {
    try {
      const response = await apiClient.get("/supportTickets/stats");
      
      // Validate response data
      if (!response.data) {
        throw new Error("No data received from API");
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching support stats:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch support statistics."
      );
    }
  },

  // Update ticket status
  async updateTicketStatus(ticketId, status) {
    try {
      const response = await apiClient.put(`/supportTickets/${ticketId}`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating ticket status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update ticket status."
      );
    }
  },

  // Assign staff to ticket
  async assignStaff(ticketId, staffId) {
    try {
      const response = await apiClient.put(`/supportTickets/${ticketId}`, {
        assigned_staff: staffId,
      });
      return response.data;
    } catch (error) {
      console.error("Error assigning staff:", error);
      throw new Error(
        error.response?.data?.message || "Failed to assign staff to ticket."
      );
    }
  },

  // Add response to ticket
  async addResponse(ticketId, response) {
    try {
      const result = await apiClient.put(`/supportTickets/${ticketId}`, {
        response,
        status: "pending",
      });
      return result.data;
    } catch (error) {
      console.error("Error adding response:", error);
      throw new Error(
        error.response?.data?.message || "Failed to add response to ticket."
      );
    }
  },
};

export default supportService;
