import apiService from "./api";

class TouristService {
  // Get tourist dashboard stats
  async getTouristStats(touristId) {
    try {
      // Get bookings for stats calculation
      const bookingsResponse = await apiService.get("/bookings", {
        user_id: touristId,
      });
      const bookings = bookingsResponse.bookings || [];

      // Get reviews for stats calculation - handle if endpoint doesn't exist
      let reviews = [];
      try {
        const reviewsResponse = await apiService.get(
          `/reviews/tourist/${touristId}`
        );
        reviews = reviewsResponse.reviews || [];
      } catch (reviewError) {}

      // Calculate stats from real data
      const now = new Date();
      const completedTours = bookings.filter(
        (booking) =>
          booking.status === "completed" ||
          (booking.status === "confirmed" &&
            new Date(booking.booking_date) < now)
      ).length;

      const upcomingTours = bookings.filter(
        (booking) =>
          booking.status === "confirmed" &&
          new Date(booking.booking_date) >= now
      ).length;

      const totalSpent = bookings.reduce((sum, booking) => {
        return sum + (parseFloat(booking.total_price) || 0);
      }, 0);

      const averageRating =
        reviews.length > 0
          ? reviews.reduce(
              (sum, review) => sum + parseFloat(review.rating || 0),
              0
            ) / reviews.length
          : 0;

      // Calculate monthly spending
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthlySpent = bookings
        .filter((booking) => {
          const bookingDate = new Date(booking.created_at);
          return (
            bookingDate.getMonth() === currentMonth &&
            bookingDate.getFullYear() === currentYear
          );
        })
        .reduce(
          (sum, booking) => sum + (parseFloat(booking.total_price) || 0),
          0
        );

      return {
        totalBookings: bookings.length,
        completedTours,
        upcomingTours,
        totalSpent,
        favoriteGuides: 0, // Will be calculated separately
        savedWishlist: 0, // Will be implemented with wishlist feature
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        membershipsLevel: this.calculateMembershipLevel(totalSpent),
        rewardPoints: Math.floor(totalSpent / 10), // 1 point per $10 spent
        monthlySpent,
        growthPercentage: 0, // Will be calculated with historical data
      };
    } catch (error) {
      // Return default stats on error
      if (
        error.message.includes("403") ||
        error.message.includes("401") ||
        error.message.includes("token")
      )
        return {
          totalBookings: 0,
          completedTours: 0,
          upcomingTours: 0,
          totalSpent: 0,
          favoriteGuides: 0,
          savedWishlist: 0,
          averageRating: 0,
          totalReviews: 0,
          membershipsLevel: "Beginner Explorer",
          rewardPoints: 0,
          monthlySpent: 0,
          growthPercentage: 0,
        };
    }
  }

  // Get tourist bookings
  async getTouristBookings(touristId, params = {}) {
    try {
      const response = await apiService.get("/bookings", {
        user_id: touristId,
        ...params,
      });

      // Transform bookings data to include additional info
      const bookings = response.bookings || [];

      // For each booking, get tour and guide details
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
          try {
            // Get tour details if tour_id exists
            if (booking.tour_id) {
              const tourResponse = await apiService.get(
                `/tours/${booking.tour_id}`
              );
              const tour = tourResponse.tour || {};

              return {
                ...booking,
                tourTitle: tour.title || booking.tour_title || "Unknown Tour",
                tourImage: tour.image_url || booking.tour_image,
                tourCategory: tour.category || booking.category,
                guideName:
                  tour.guide_name || booking.guide_name || "Unknown Guide",
                guideAvatar: tour.guide_avatar || booking.guide_avatar,
                location:
                  tour.location || booking.location || "Location not specified",
              };
            } else {
              return {
                ...booking,
                tourTitle: booking.tour_title || "Unknown Tour",
                guideName: booking.guide_name || "Unknown Guide",
                location: booking.location || "Location not specified",
              };
            }
          } catch (err) {
            return {
              ...booking,
              tourTitle: booking.tour_title || "Unknown Tour",
              guideName: booking.guide_name || "Unknown Guide",
              location: booking.location || "Location not specified",
            };
          }
        })
      );

      return enrichedBookings;
    } catch (error) {
      // Return empty array instead of throwing for auth errors
      if (
        error.message.includes("403") ||
        error.message.includes("401") ||
        error.message.includes("token")
      ) {
        return [];
      }

      throw error;
    }
  }

  // Get upcoming tours
  async getUpcomingTours(touristId) {
    try {
      // Try new backend API first
      const response = await apiService.get(
        `/tourist/upcoming-tours/${touristId}`
      );
      if (response.success) {
        return response.upcomingTours || [];
      }
    } catch (error) {}

    // Fallback to old method
    try {
      const bookings = await this.getTouristBookings(touristId);

      const now = new Date();
      const upcomingBookings = bookings.filter(
        (booking) =>
          booking.status === "confirmed" &&
          new Date(booking.booking_date) >= now
      );

      // Sort by booking date
      return upcomingBookings.sort(
        (a, b) => new Date(a.booking_date) - new Date(b.booking_date)
      );
    } catch (error) {
      throw error;
    }
  }

  // Get recent activities
  async getRecentActivities(touristId) {
    try {
      // Try new backend API first
      const response = await apiService.get(
        `/tourist/recent-activities/${touristId}`
      );
      if (response.success) {
        return response.activities || [];
      }
    } catch (error) {}

    // Fallback to old method
    try {
      const [bookings, reviews] = await Promise.all([
        this.getTouristBookings(touristId),
        this.getTouristReviews(touristId),
      ]);

      const activities = [];

      // Add booking activities
      bookings.slice(0, 5).forEach((booking) => {
        activities.push({
          id: `booking-${booking.id}`,
          type: "booking",
          title: "New Booking Confirmed",
          description: `${booking.tourTitle} with ${booking.guideName}`,
          timestamp: new Date(booking.created_at),
          status: booking.status,
          booking,
        });
      });

      // Add review activities
      reviews.slice(0, 3).forEach((review) => {
        activities.push({
          id: `review-${review.id}`,
          type: "review",
          title: "Review Submitted",
          description: `Left a ${review.rating}-star review for ${review.tour_title}`,
          timestamp: new Date(review.created_at),
          rating: review.rating,
          review,
        });
      });

      // Sort by timestamp (newest first)
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    } catch (error) {
      throw error;
    }
  }

  // Get tourist reviews
  async getTouristReviews(touristId, params = {}) {
    try {
      const response = await apiService.get(
        `/reviews/tourist/${touristId}`,
        params
      );
      return response.reviews || [];
    } catch (error) {
      throw error;
    }
  }

  // Get favorite guides (based on bookings and reviews)
  async getFavoriteGuides(touristId) {
    try {
      const [bookings, reviews] = await Promise.all([
        this.getTouristBookings(touristId),
        this.getTouristReviews(touristId),
      ]);

      // Count interactions with guides
      const guideStats = {};

      bookings.forEach((booking) => {
        if (booking.guide_id) {
          if (!guideStats[booking.guide_id]) {
            guideStats[booking.guide_id] = {
              guideId: booking.guide_id,
              guideName: booking.guideName,
              guideAvatar: booking.guideAvatar,
              bookingCount: 0,
              totalSpent: 0,
              averageRating: 0,
              reviewCount: 0,
            };
          }
          guideStats[booking.guide_id].bookingCount++;
          guideStats[booking.guide_id].totalSpent += booking.total_price || 0;
        }
      });

      // Add review data
      reviews.forEach((review) => {
        if (review.guide_id && guideStats[review.guide_id]) {
          guideStats[review.guide_id].reviewCount++;
          const currentAvg = guideStats[review.guide_id].averageRating;
          const count = guideStats[review.guide_id].reviewCount;
          guideStats[review.guide_id].averageRating =
            (currentAvg * (count - 1) + review.rating) / count;
        }
      });

      // Convert to array and sort by interaction frequency
      const favoriteGuides = Object.values(guideStats)
        .map((guide) => ({
          ...guide,
          totalInteractions: guide.bookingCount + guide.reviewCount,
          averageRating: Math.round(guide.averageRating * 10) / 10,
        }))
        .sort((a, b) => b.totalInteractions - a.totalInteractions)
        .slice(0, 10);

      return favoriteGuides;
    } catch (error) {
      throw error;
    }
  }

  // Get available tours for wishlist
  async getAvailableTours(params = {}) {
    try {
      const response = await apiService.get("/tours", {
        limit: 20,
        ...params,
      });
      return response.tours || [];
    } catch (error) {
      throw error;
    }
  }

  // Calculate membership level based on spending
  calculateMembershipLevel(totalSpent) {
    if (totalSpent >= 5000) return "VIP Explorer";
    if (totalSpent >= 2000) return "Advanced Explorer";
    if (totalSpent >= 500) return "Explorer";
    return "Beginner Explorer";
  }

  // Create a booking
  async createBooking(bookingData) {
    try {
      const response = await apiService.post("/bookings", bookingData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update booking
  async updateBooking(bookingId, updateData) {
    try {
      const response = await apiService.put(
        `/bookings/${bookingId}`,
        updateData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    try {
      const response = await apiService.put(`/bookings/${bookingId}/status`, {
        status: "cancelled",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create review
  async createReview(reviewData) {
    try {
      const response = await apiService.post("/reviews", reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await apiService.put(`/reviews/${reviewId}`, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete review
  async deleteReview(reviewId) {
    try {
      const response = await apiService.delete(`/reviews/${reviewId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

const touristService = new TouristService();
export default touristService;
