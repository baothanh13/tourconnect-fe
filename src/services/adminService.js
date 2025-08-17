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

export const adminService = {
  // User Management
  async getAllUsers(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (filters.verified !== undefined)
        params.append("verified", filters.verified);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString ? `/admin/users?${queryString}` : "/admin/users";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch users."
      );
    }
  },

  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details."
      );
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update user status."
      );
    }
  },

  async verifyUser(userId, verified = true) {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/verify`, {
        is_verified: verified,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to verify user."
      );
    }
  },

  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete user."
      );
    }
  },

  // Guide Management
  async getAllGuides(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.verification_status)
        params.append("verification_status", filters.verification_status);
      if (filters.location) params.append("location", filters.location);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/admin/guides?${queryString}`
        : "/admin/guides";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching guides:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch guides."
      );
    }
  },

  async verifyGuide(guideId, verification_status) {
    try {
      const response = await apiClient.put(`/admin/guides/${guideId}/verify`, {
        verification_status,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying guide:", error);
      throw new Error(
        error.response?.data?.message || "Failed to verify guide."
      );
    }
  },

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const response = await apiClient.get("/admin/stats/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard statistics."
      );
    }
  },

  // Get recent platform activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await apiClient.get(`/admin/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch recent activities."
      );
    }
  },
};

export default adminService;
