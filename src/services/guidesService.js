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
      // Add cache busting parameter to ensure fresh data
      const timestamp = Date.now() + Math.random();
      const response = await apiClient.get(
        `/user/${userId}?t=${timestamp}&_=${Math.random()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching guide by user ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch guide profile."
      );
    }
  },

  // Create guide profile (POST /api/guides)
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

  // Update guide profile (PUT /api/guides/{id})
  async updateGuideProfile(guideId, guideData) {
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

  // Delete guide profile
  async deleteGuide(guideId) {
    try {
      const response = await apiClient.delete(`/${guideId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting guide:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete guide profile."
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

  // Update certificate image by user ID
  async updateCertificateImage(userId, certificateImgUrl) {
    try {
      const response = await apiClient.put(`/certificate/${userId}`, {
        certificate_img: certificateImgUrl
      });
      return response.data;
    } catch (error) {
      console.error("Error updating certificate image:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update certificate image."
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
        ? `/reviews/${guideId}?${queryString}`
        : `/reviews/${guideId}`;

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
