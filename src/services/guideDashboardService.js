import { guidesService } from "./guidesService";
import { toursService } from "./toursService";
import { bookingsService } from "./bookingsService";

export const guideDashboardService = {
  // Get comprehensive guide dashboard data
  async getGuideDashboardData(userId, guideId) {
    try {
      // Fetch all data in parallel
      const [guideProfile, guideTours, guideBookings, guideReviews] =
        await Promise.all([
          guidesService.getGuideByUserId(userId),
          toursService.getToursByGuide(guideId, { limit: 100 }),
          bookingsService.getGuideBookings(guideId, { limit: 100 }),
          guidesService
            .getGuideReviews(guideId, { limit: 100 })
            .catch(() => ({ reviews: [], totalReviews: 0, averageRating: 0 })),
        ]);

      // Calculate statistics
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
    } catch (error) {
      console.error("Error fetching guide dashboard data:", error);
      throw new Error("Failed to load dashboard data");
    }
  },

  // Calculate guide statistics
  calculateGuideStats(profile, toursData, bookingsData, reviewsData) {
    const tours = toursData.tours || [];
    const bookings = bookingsData.bookings || bookingsData || [];
    const reviews = reviewsData.reviews || [];

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
        : profile.rating || 0;

    const totalReviews = reviews.length || profile.total_reviews || 0;

    return {
      totalTours,
      activeTours,
      totalBookings,
      completedTours: completedBookings,
      upcomingTours: upcomingBookings,
      pendingBookings,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      verificationStatus: profile.verification_status || "pending",
    };
  },

  // Get recent activities
  async getRecentActivities(guideId, limit = 10) {
    try {
      const [recentBookings] = await Promise.all([
        bookingsService.getGuideBookings(guideId, {
          limit,
          sortBy: "created_at",
          sortOrder: "desc",
        }),
      ]);

      const activities = [];

      // Add booking activities
      const bookings = recentBookings.bookings || recentBookings || [];
      bookings.forEach((booking) => {
        activities.push({
          id: `booking-${booking.id}`,
          type: "booking",
          title: `New booking from ${booking.tourist_name || "Tourist"}`,
          description: `Booking for ${booking.date} - ${booking.time_slot}`,
          timestamp: booking.created_at,
          status: booking.status,
          data: booking,
        });
      });

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return activities.slice(0, limit);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
  },

  // Get earnings by period
  async getEarningsByPeriod(guideId, period = "month") {
    try {
      const bookings = await bookingsService.getGuideBookings(guideId, {
        status: "completed",
        limit: 1000,
      });

      const completedBookings = bookings.bookings || bookings || [];
      const earningsByPeriod = {};

      completedBookings.forEach((booking) => {
        if (booking.status === "completed" && booking.total_price) {
          const date = new Date(booking.date);
          let key;

          switch (period) {
            case "day":
              key = date.toISOString().split("T")[0];
              break;
            case "week":
              const startOfWeek = new Date(date);
              startOfWeek.setDate(date.getDate() - date.getDay());
              key = startOfWeek.toISOString().split("T")[0];
              break;
            case "month":
              key = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`;
              break;
            case "year":
              key = date.getFullYear().toString();
              break;
            default:
              key = date.toISOString().split("T")[0];
          }

          earningsByPeriod[key] =
            (earningsByPeriod[key] || 0) + parseFloat(booking.total_price);
        }
      });

      return earningsByPeriod;
    } catch (error) {
      console.error("Error fetching earnings by period:", error);
      return {};
    }
  },

  // Get upcoming bookings
  async getUpcomingBookings(guideId, limit = 5) {
    try {
      const bookings = await bookingsService.getGuideBookings(guideId, {
        status: "confirmed",
        limit: 100,
      });

      const allBookings = bookings.bookings || bookings || [];
      const upcomingBookings = allBookings
        .filter((booking) => new Date(booking.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);

      return upcomingBookings;
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      return [];
    }
  },
};

export default guideDashboardService;
