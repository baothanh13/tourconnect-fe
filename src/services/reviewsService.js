import apiService from "./api";

export const reviewsService = {
  async getAllReviews(params = {}) {
    // Backend returns { reviews: [...] } according to controller
    return apiService.get("/reviews", params);
  },
};

export default reviewsService;


