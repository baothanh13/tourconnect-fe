import { guidesService } from "./guidesService";
import { toursService } from "./toursService";
import { bookingsService } from "./bookingsService";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const guideDashboardService = {
  // Get comprehensive guide dashboard data using new backend API
  async getGuideDashboardData(userId, guideId) {
    try {
      const token = localStorage.getItem("tourconnect_token");

      // Use new backend API endpoint first
      try {
        const response = await fetch(
          `${API_BASE_URL}/guides/dashboard/${userId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          return {
            profile: data.guide,
            stats: data.stats,
          };
        } else {
          throw new Error(`API returned status: ${response.status}`);
        }
      } catch (apiError) {
        // If new API fails, try legacy method with better error handling
        try {
          const [guideProfile, guideTours, guideBookings, guideReviews] =
            await Promise.all([
              guidesService.getGuideByUserId(userId),
              toursService
                .getToursByGuide(guideId, { limit: 100 })
                .catch(() => ({ tours: [] })),
              bookingsService
                .getGuideBookings(guideId, { limit: 100 })
                .catch(() => ({ bookings: [] })),
              guidesService
                .getGuideReviews(guideId, { limit: 100 })
                .catch(() => ({
                  reviews: [],
                  totalReviews: 0,
                  averageRating: 0,
                })),
            ]);

          // Calculate statistics using legacy method
          const stats = this.calculateGuideStats(
            guideProfile,
            guideTours,
            guideBookings,
            guideReviews
          );

          return {
            profile: guideProfile,
            tours: guideTours,
            bookings: guideBookings,
            reviews: guideReviews,
            stats,
          };
        } catch (legacyError) {
          throw new Error(
            "Failed to load dashboard data from both new and legacy APIs"
          );
        }
      }
    } catch (error) {
      throw error;
    }
  },

  // Calculate guide statistics (legacy method)
  calculateGuideStats(profile, toursData, bookingsData, reviewsData) {
    const tours = toursData?.tours || [];
    const bookings = bookingsData?.bookings || bookingsData || [];
    const reviews = reviewsData?.reviews || [];

    // Tour statistics
    const totalTours = tours.length;
    const activeTours = tours.filter(
      (tour) => tour.status !== "deleted"
    ).length;

    // Booking statistics
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(
      (booking) => booking.status === "completed"
    ).length;
    const upcomingBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.date) > new Date()
    ).length;
    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    // Revenue calculation
    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + (parseFloat(booking.total_price) || 0),
      0
    );

    // Rating calculation
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
          reviews.length
        : profile?.rating || 0;

    const totalReviews = reviews.length || profile?.total_reviews || 0;

    return {
      totalTours,
      activeTours,
      totalBookings,
      completedTours: completedBookings,
      upcomingTours: upcomingBookings,
      pendingBookings,
      totalEarnings,
      monthlyEarnings: Math.round(totalEarnings * 0.3), // Mock calculation
      growthPercentage: 15.5, // Mock value
      averageRating: Math.round((averageRating || 0) * 10) / 10,
      totalReviews,
      totalCustomers: completedBookings * 2, // Estimate
      verificationStatus: profile?.verification_status || "pending",
    };
  },

  // Get recent activities using new API
  async getRecentActivities(userId, limit = 5) {
    try {
      const token = localStorage.getItem("tourconnect_token");

      // Try new backend API first
      const response = await fetch(
        `${API_BASE_URL}/guides/dashboard/${userId}/activities?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.activities || [];
      } else {
        // If API fails, return mock data as fallback
        return this.getMockActivities(limit);
      }
    } catch (error) {
      // Return mock data if API call fails
      return this.getMockActivities(limit);
    }
  },

  // Get upcoming bookings using new API
  async getUpcomingBookings(userId, limit = 5) {
    try {
      const token = localStorage.getItem("tourconnect_token");

      // Try new backend API first
      const response = await fetch(
        `${API_BASE_URL}/guides/dashboard/${userId}/bookings?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.bookings || [];
      } else {
        // If API fails, return mock data as fallback
        return this.getMockUpcomingBookings(limit);
      }
    } catch (error) {
      // Return mock data if API call fails
      return this.getMockUpcomingBookings(limit);
    }
  },

  // Mock data for activities
  getMockActivities(limit = 5) {
    const mockActivities = [
      {
        id: "act_1",
        type: "booking",
        title: "New Booking Request",
        description: "Tourist requested a 3-day Vietnam cultural tour",
        status: "pending",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act_2",
        type: "review",
        title: "New Review Received",
        description: "5-star review: 'Amazing experience with great guide!'",
        status: "completed",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act_3",
        type: "payment",
        title: "Payment Received",
        description: "$150 payment for Hanoi Old Quarter tour",
        status: "completed",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act_4",
        type: "booking",
        title: "Tour Completed",
        description: "Successfully completed Saigon street food tour",
        status: "completed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act_5",
        type: "booking",
        title: "Booking Confirmed",
        description: "Confirmed booking for Mekong Delta adventure",
        status: "confirmed",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return mockActivities.slice(0, limit);
  },

  // Mock data for upcoming bookings
  getMockUpcomingBookings(limit = 5) {
    const mockBookings = [
      {
        id: "book_1",
        tourist_name: "John Smith",
        tourist_email: "john@example.com",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        time_slot: "09:00",
        number_of_tourists: 2,
        total_price: 120,
        status: "confirmed",
        tour_title: "Hanoi Old Quarter Walking Tour",
      },
      {
        id: "book_2",
        tourist_name: "Sarah Johnson",
        tourist_email: "sarah@example.com",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        time_slot: "14:30",
        number_of_tourists: 4,
        total_price: 280,
        status: "confirmed",
        tour_title: "Ho Chi Minh City Street Food Tour",
      },
      {
        id: "book_3",
        tourist_name: "Michael Brown",
        tourist_email: "michael@example.com",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        time_slot: "08:00",
        number_of_tourists: 1,
        total_price: 85,
        status: "pending",
        tour_title: "Mekong Delta Day Trip",
      },
    ];

    return mockBookings.slice(0, limit);
  },
};

export default guideDashboardService;
