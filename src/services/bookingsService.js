import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/bookings";

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

export const bookingsService = {
  // Create new booking
  async createBooking(bookingData) {
    try {
      // Use the data as-is since frontend already prepares it correctly
      const backendBookingData = bookingData;

      const response = await apiClient.post("/", backendBookingData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create booking."
      );
    }
  },

  // Get all bookings with filters (for admin and users)
  async getBookings(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.guideId) params.append("guideId", filters.guideId);
      if (filters.touristId) params.append("touristId", filters.touristId);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error();
    }
  },
  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      const response = await apiClient.get(`/${bookingId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking details."
      );
    }
  },
  // Update booking
  async updateBooking(bookingId, updateData) {
    try {
      const response = await apiClient.put(`/${bookingId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update booking."
      );
    }
  },

  // Update booking status (for guides - accept/decline)
  async updateBookingStatus(bookingId, status, response_message = "") {
    try {
      const response = await apiClient.put(`/${bookingId}/status`, {
        status,
        response_message,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update booking status."
      );
    }
  },

  // Cancel booking
  async cancelBooking(bookingId, reason = "") {
    try {
      const response = await apiClient.put(`/${bookingId}/cancel`, {
        cancellation_reason: reason,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel booking."
      );
    }
  },

  // Get user's bookings (tourist's bookings)
  async getTouristBookings(touristId, filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/tourist/${touristId}?${queryString}`
        : `/tourist/${touristId}`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch your bookings."
      );
    }
  },

  // Get guide's bookings
  async getGuideBookings(guideId, filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/guide/${guideId}?${queryString}`
        : `/guide/${guideId}`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch guide bookings."
      );
    }
  },

  // Get all bookings (admin function)
  async getAllBookings(options = {}) {
    try {
      const params = new URLSearchParams();

      if (options.status) params.append("status", options.status);
      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);
      if (options.sortBy) params.append("sortBy", options.sortBy);
      if (options.sortOrder) params.append("sortOrder", options.sortOrder);

      const queryString = params.toString();
      const url = queryString ? `/admin/all?${queryString}` : "/admin/all";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch all bookings."
      );
    }
  },

  // Get booking statistics (admin function)
  async getBookingStats() {
    try {
      const response = await apiClient.get("/admin/stats");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch booking statistics."
      );
    }
  },

  // Rate tourist (for guides)
  async rateTourist(bookingId, rating, comment = "") {
    try {
      const response = await apiClient.post(`/${bookingId}/rate-tourist`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to rate tourist."
      );
    }
  },

  // Rate guide (for tourists)
  async rateGuide(bookingId, rating, comment = "") {
    try {
      const response = await apiClient.post(`/${bookingId}/rate-guide`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to rate guide.");
    }
  },

  // Get booking reviews
  async getBookingReviews(bookingId) {
    try {
      const response = await apiClient.get(`/${bookingId}/reviews`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reviews."
      );
    }
  },

  // Mark booking as completed
  async markBookingCompleted(bookingId, completion_notes = "") {
    try {
      const response = await apiClient.put(`/${bookingId}/complete`, {
        completion_notes,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to mark booking as completed."
      );
    }
  },
};

export default bookingsService;
