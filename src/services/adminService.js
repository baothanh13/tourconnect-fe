import apiService from "./api";

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      // For now, return mock data. Replace with real API call when backend is ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalGuides: 245,
            totalTourists: 1823,
            totalBookings: 567,
            totalRevenue: 125430,
            pendingVerifications: 12,
            activeUsers: 189,
            guidesGrowth: 15.2,
            touristsGrowth: 28.7,
            bookingsGrowth: 12.1,
            revenueGrowth: 22.8,
          });
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/admin/dashboard/stats');
    } catch (error) {
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }
  },

  // Get recent platform activities
  async getRecentActivities(limit = 10) {
    try {
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "New Guide Registration",
              description: "Phạm Thị Lan registered as a guide in Hoi An",
              icon: "🎯",
              createdAt: new Date(
                Date.now() - 2 * 60 * 60 * 1000
              ).toISOString(),
              type: "registration",
            },
            {
              id: 2,
              title: "Booking Completed",
              description: "Tour booking #234 completed successfully",
              icon: "✅",
              createdAt: new Date(
                Date.now() - 4 * 60 * 60 * 1000
              ).toISOString(),
              type: "booking",
            },
            {
              id: 3,
              title: "Payment Processed",
              description: "$250 payment processed for booking #233",
              icon: "💰",
              createdAt: new Date(
                Date.now() - 6 * 60 * 60 * 1000
              ).toISOString(),
              type: "payment",
            },
            {
              id: 4,
              title: "Guide Verification",
              description: "Guide verification pending for John Smith",
              icon: "⏳",
              createdAt: new Date(
                Date.now() - 8 * 60 * 60 * 1000
              ).toISOString(),
              type: "verification",
            },
            {
              id: 5,
              title: "New Review",
              description: "5-star review received for guide Maria",
              icon: "⭐",
              createdAt: new Date(
                Date.now() - 12 * 60 * 60 * 1000
              ).toISOString(),
              type: "review",
            },
          ]);
        }, 300);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/admin/activities?limit=${limit}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch activities");
    }
  },

  // Verify a guide
  async verifyGuide(guideId) {
    try {
      // Mock verification for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Guide verified successfully",
            guideId,
            verifiedAt: new Date().toISOString(),
          });
        }, 1000);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/admin/guides/${guideId}/verify`);
    } catch (error) {
      throw new Error(error.message || "Failed to verify guide");
    }
  },

  // Suspend a user
  async suspendUser(userId, reason = "") {
    try {
      // Mock suspension for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "User suspended successfully",
            userId,
            reason,
            suspendedAt: new Date().toISOString(),
          });
        }, 1000);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/admin/users/${userId}/suspend`, { reason });
    } catch (error) {
      throw new Error(error.message || "Failed to suspend user");
    }
  },

  // Get all users with filters
  async getAllUsers(filters = {}) {
    try {
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "John Smith",
              email: "john@example.com",
              userType: "guide",
              isVerified: true,
              status: "active",
              location: "Paris, France",
              createdAt: "2024-01-15T10:30:00Z",
              lastLoginAt: "2024-01-20T14:20:00Z",
            },
            {
              id: 2,
              name: "Maria Garcia",
              email: "maria@example.com",
              userType: "guide",
              isVerified: false,
              status: "pending",
              location: "Barcelona, Spain",
              createdAt: "2024-01-18T09:15:00Z",
              lastLoginAt: null,
            },
          ]);
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/admin/users', filters);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  // Get platform analytics
  async getAnalytics(period = "30d") {
    try {
      // Mock analytics for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            period,
            userGrowth: 25.5,
            bookingGrowth: 18.2,
            revenueGrowth: 22.8,
            conversionRate: 3.4,
          });
        }, 600);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/admin/analytics?period=${period}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch analytics");
    }
  },

  // Handle content management
  async updatePlatformContent(contentType, data) {
    try {
      // Mock content update for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            contentType,
            updatedAt: new Date().toISOString(),
          });
        }, 800);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/admin/content/${contentType}`, data);
    } catch (error) {
      throw new Error(error.message || "Failed to update content");
    }
  },
};
