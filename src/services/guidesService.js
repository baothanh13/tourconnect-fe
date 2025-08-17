import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/guides";

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

export const guidesService = {
  // Get all guides with filters
  async getGuides(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add filters to query params
      if (filters.location) params.append("location", filters.location);
      if (filters.language) params.append("language", filters.language);
      if (filters.category) params.append("category", filters.category);
      if (filters.minRating) params.append("minRating", filters.minRating);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.available !== undefined)
        params.append("available", filters.available);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching guides:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch guides."
      );
    }
  },

  // Get guide by ID
  async getGuideById(guideId) {
    try {
      const response = await apiClient.get(`/${guideId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching guide by ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch guide details."
      );
    }
  },

  // Get guide by user ID (for dashboard)
  async getGuideByUserId(userId) {
    try {
      const response = await apiClient.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching guide by user ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch guide profile."
      );
    }
  },

  // Create guide profile
  async createGuide(guideData) {
    try {
      const response = await apiClient.post("/", guideData);
      return response.data;
    } catch (error) {
      console.error("Error creating guide:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create guide profile."
      );
    }
  },

  // Update guide profile
  async updateGuide(guideId, guideData) {
    try {
      const response = await apiClient.put(`/${guideId}`, guideData);
      return response.data;
    } catch (error) {
      console.error("Error updating guide:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update guide profile."
      );
    }
  },

  // Create guide profile (additional endpoint)
  async createGuideProfile(profileData) {
    try {
      const response = await apiClient.post("/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating guide profile:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create guide profile."
      );
    }
  },

  // Search guides
  async searchGuides(searchParams) {
    try {
      const params = new URLSearchParams();

      if (searchParams.query) params.append("query", searchParams.query);
      if (searchParams.location)
        params.append("location", searchParams.location);
      if (searchParams.category)
        params.append("category", searchParams.category);
      if (searchParams.minRating)
        params.append("minRating", searchParams.minRating);
      if (searchParams.priceRange)
        params.append("priceRange", searchParams.priceRange);

      const queryString = params.toString();
      const url = queryString ? `/search?${queryString}` : "/search";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching guides:", error);
      throw new Error(error.response?.data?.message || "Search failed.");
    }
  },

  // Get all guides (admin function)
  async getAllGuides(options = {}) {
    try {
      const params = new URLSearchParams();

      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);
      if (options.status) params.append("status", options.status);
      if (options.verified !== undefined)
        params.append("verified", options.verified);

      const queryString = params.toString();
      const url = queryString ? `/admin/all?${queryString}` : "/admin/all";

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching all guides:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch all guides."
      );
    }
  },

  // Update guide profile (for guides themselves)
  async updateGuideProfile(id, guideData) {
    try {
      const response = await apiClient.put(`/profile/${id}`, guideData);
      return response.data;
    } catch (error) {
      console.error("Error updating guide profile:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update guide profile."
      );
    }
  },

  // Upload guide images
  async uploadGuideImages(guideId, images) {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await axios.post(
        `${API_BASE_URL}/${guideId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "tourconnect_token"
            )}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading guide images:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload images."
      );
    }
  },

  // Update guide availability
  async updateAvailability(guideId, availability) {
    try {
      const response = await apiClient.put(`/${guideId}/availability`, {
        is_available: availability,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating guide availability:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update availability."
      );
    }
  },

  // Get guide reviews
  async getGuideReviews(guideId, options = {}) {
    try {
      const params = new URLSearchParams();

      if (options.page) params.append("page", options.page);
      if (options.limit) params.append("limit", options.limit);

      const queryString = params.toString();
      const url = queryString
        ? `/${guideId}/reviews?${queryString}`
        : `/${guideId}/reviews`;

      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching guide reviews:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch reviews."
      );
    }
  },
};

export default guidesService;
