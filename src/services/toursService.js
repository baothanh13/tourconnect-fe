import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tours";

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

export const toursService = {
  // Get all tours with filters
  async getTours(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.guide_id) params.append("guide_id", filters.guide_id);
      if (filters.q) params.append("q", filters.q);

      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch tours."
      );
    }
  },

  // Get tours by week for schedule view
  async getToursByWeek(date, guideId) {
    try {
      const params = new URLSearchParams();
      params.append("guide_id", guideId);
      params.append("date", date);

      const response = await apiClient.get(`/week?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tours by week:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch weekly tours."
      );
    }
  },

  // Get tours by guide ID
  async getToursByGuide(guideId, filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/guide/${guideId}?${queryString}`
        : `/guide/${guideId}`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching tours by guide:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch guide tours."
      );
    }
  },

  // Get tour by ID
  async getTourById(tourId) {
    try {
      const response = await apiClient.get(`/${tourId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tour by ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch tour details."
      );
    }
  },

  // Create new tour
  async createTour(tourData) {
    try {
      const response = await apiClient.post("/", tourData);
      return response.data;
    } catch (error) {
      console.error("Error creating tour:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create tour."
      );
    }
  },

  // Update tour
  async updateTour(tourId, tourData) {
    try {
      const response = await apiClient.put(`/${tourId}`, tourData);
      return response.data;
    } catch (error) {
      console.error("Error updating tour:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update tour."
      );
    }
  },

  // Delete tour
  async deleteTour(tourId) {
    try {
      const response = await apiClient.delete(`/${tourId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting tour:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete tour."
      );
    }
  },

  // Get tour statistics for guide
  async getTourStats(guideId) {
    try {
      const response = await apiClient.get(`/guide/${guideId}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tour stats:", error);
      // Return empty stats if endpoint doesn't exist
      return {
        totalTours: 0,
        activeTours: 0,
        draftTours: 0,
        totalBookings: 0,
        averageRating: 0,
        totalRevenue: 0,
      };
    }
  },

};

export default toursService;
