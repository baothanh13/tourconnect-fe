import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

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

// Response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("tourconnect_token");
      localStorage.removeItem("tourconnect_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details."
      );
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      const response = await apiClient.put(
        `/admin/users/${userId}/profile`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update user profile."
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
      throw new Error(
        error.response?.data?.message || "Failed to delete user."
      );
    }
  },

  async createUser(userData) {
    try {
      const response = await apiClient.post("/admin/users", userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create user."
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
      throw new Error(
        error.response?.data?.message || "Failed to fetch guides."
      );
    }
  },

  async verifyGuide(guideId, verification_status) {
    try {
      const response = await apiClient.put(
        `/admin/guides/${guideId}/verification`,
        {
          status: verification_status,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to verify guide."
      );
    }
  },

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const response = await apiClient.get("/admin/stats");
      return response.data;
    } catch (error) {
      // Return mock data as fallback
      return {
        total_users: 0,
        total_guides: 0,
        total_bookings: 0,
      };
    }
  },

  // Get all bookings with proper error handling
  async getAllBookings(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/admin/bookings?${queryString}`
        : "/admin/bookings";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return []; // Return empty array as fallback
    }
  },

  // Get recent platform activities
  async getRecentActivities(limit = 10) {
    try {
      const response = await apiClient.get(`/admin/activities?limit=${limit}`);
      return response.data;
    } catch (error) {
      // Return mock activities as fallback that match the backend structure
      return {
        activities: [
          {
            id: "fallback_1",
            type: "booking",
            title: "Booking Created (Fallback)",
            description: "Unable to load live activities",
            status: "info",
            timestamp: new Date().toISOString(),
          },
          {
            id: "fallback_2",
            type: "user",
            title: "User Registered (Fallback)",
            description: "Unable to load live activities",
            status: "created",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ],
      };
    }
  },

    // Delete booking
  async deleteBooking(bookingId) {
    try {
      const response = await apiClient.delete(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete booking."
      );
    }
  },


  // Get revenue statistics
  async getRevenueStats() {
    try {
      const response = await apiClient.get("/admin/stats");
      const data = response.data;

      // Map the API response fields to what the frontend expects
      return {
        total_revenue: parseFloat(data.total_bookings_revenue || 0),
        monthly_revenue: parseFloat(data.monthly_revenue || 0),
      };
    } catch (error) {
      // Return mock revenue data
      return {
        total_revenue: 125780,
        monthly_revenue: 15650,
      };
    }
  },

  // Get user details by ID
  async getUserDetails(userId) {
    try {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  async updatePaymentStatus(bookingId, payment_status) {
    try {
      const response = await apiClient.put(
        `/admin/${bookingId}/payment_status`,
        { payment_status }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update payment status."
      );
    }
  },

  // Get guide details by ID
  async getGuideDetails(guideId) {
    try {
      const response = await apiClient.get(`/guides/${guideId}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Enhanced booking fetching with user/guide details
  async getAllBookingsWithDetails(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/admin/bookings?${queryString}`
        : "/admin/bookings";

      const response = await apiClient.get(url);
      const bookings = Array.isArray(response.data) ? response.data : [];

      // Fetch additional details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const [touristDetails, guideDetails] = await Promise.all([
            booking.tourist_id ? this.getUserDetails(booking.tourist_id) : null,
            booking.guide_id ? this.getGuideDetails(booking.guide_id) : null,
          ]);

          return {
            ...booking,
            tourist_name:
              touristDetails?.name ||
              touristDetails?.user?.name ||
              `Tourist ${booking.tourist_id?.substring(0, 8)}...`,
            tourist_email:
              touristDetails?.email || touristDetails?.user?.email || "N/A",
            guide_name:
              guideDetails?.name ||
              guideDetails?.guide?.name ||
              `Guide ${booking.guide_id?.substring(0, 8)}...`,
            guide_email:
              guideDetails?.email || guideDetails?.guide?.email || "N/A",
            tour_name: "Custom Tour", // Since we don't have tour details, use a default name
          };
        })
      );

      return bookingsWithDetails;
    } catch (error) {
      // Fallback to regular booking fetch
      return this.getAllBookings(filters);
    }
  },
};

export default adminService;
