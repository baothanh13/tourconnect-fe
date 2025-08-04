import apiService from "./api";

export const usersService = {
  // Get all users (admin function)
  async getAllUsers(options = {}) {
    try {
      // Mock users data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Sarah Johnson",
              email: "sarah@email.com",
              userType: "tourist",
              status: "active",
              createdAt: "2023-06-15T10:30:00Z",
              lastLoginAt: "2024-01-20T14:20:00Z",
              totalBookings: 3,
              totalSpent: 275,
              location: "New York, USA",
              isVerified: true,
            },
            {
              id: 2,
              name: "Phạm Thị Lan",
              email: "lan.pham@email.com",
              userType: "guide",
              status: "active",
              createdAt: "2020-03-15T10:30:00Z",
              lastLoginAt: "2024-01-20T14:20:00Z",
              totalBookings: 127,
              totalEarned: 5715,
              location: "Hoi An, Vietnam",
              isVerified: true,
            },
            {
              id: 3,
              name: "Michael Chen",
              email: "michael@email.com",
              userType: "tourist",
              status: "active",
              createdAt: "2023-11-22T16:45:00Z",
              lastLoginAt: "2024-01-19T11:30:00Z",
              totalBookings: 1,
              totalSpent: 85,
              location: "Toronto, Canada",
              isVerified: true,
            },
            {
              id: 4,
              name: "Carlos Rodriguez",
              email: "carlos@email.com",
              userType: "guide",
              status: "pending",
              createdAt: "2024-01-18T09:15:00Z",
              lastLoginAt: null,
              totalBookings: 0,
              totalEarned: 0,
              location: "Barcelona, Spain",
              isVerified: false,
            },
            {
              id: 5,
              name: "Admin User",
              email: "admin@tourconnect.com",
              userType: "admin",
              status: "active",
              createdAt: "2020-01-01T00:00:00Z",
              lastLoginAt: "2024-01-20T15:45:00Z",
              location: "System",
              isVerified: true,
            },
          ]);
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/admin/users', options);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch users");
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      // Mock user details
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: parseInt(userId),
            name: "Sarah Johnson",
            email: "sarah@email.com",
            userType: "tourist",
            status: "active",
            createdAt: "2023-06-15T10:30:00Z",
            lastLoginAt: "2024-01-20T14:20:00Z",
            location: "New York, USA",
            isVerified: true,
            profile: {
              avatar:
                "https://images.unsplash.com/photo-1494790108755-2616b612b1d4?w=400&h=400&fit=crop&crop=face",
              bio: "Travel enthusiast exploring the world one guide at a time",
              languages: ["English", "Spanish"],
              interests: ["Culture", "Food", "History"],
              phone: "+1-555-0123",
              dateOfBirth: "1992-05-15",
              preferences: {
                currency: "USD",
                notifications: true,
                privateProfile: false,
              },
            },
            stats: {
              totalBookings: 3,
              totalSpent: 275,
              favoriteGuides: 5,
              reviewsGiven: 3,
            },
          });
        }, 300);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/users/${userId}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user details");
    }
  },

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      // Mock profile update
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Profile updated successfully",
            userId,
            ...profileData,
            updatedAt: new Date().toISOString(),
          });
        }, 800);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/users/${userId}/profile`, profileData);
    } catch (error) {
      throw new Error(error.message || "Failed to update profile");
    }
  },

  // Change user password
  async changePassword(userId, passwordData) {
    try {
      // Mock password change
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Password changed successfully",
          });
        }, 600);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/users/${userId}/password`, passwordData);
    } catch (error) {
      throw new Error(error.message || "Failed to change password");
    }
  },

  // Upload user avatar
  async uploadAvatar(userId, avatarFile) {
    try {
      // Mock avatar upload
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Avatar uploaded successfully",
            avatarUrl: `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400&fit=crop&crop=face`,
          });
        }, 1200);
      });

      // Uncomment when backend is ready:
      // return await apiService.uploadFile(`/users/${userId}/avatar`, avatarFile);
    } catch (error) {
      throw new Error(error.message || "Failed to upload avatar");
    }
  },

  // Suspend user (admin function)
  async suspendUser(userId, reason) {
    try {
      // Mock user suspension
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "User suspended successfully",
            userId,
            status: "suspended",
            reason,
            suspendedAt: new Date().toISOString(),
          });
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/admin/users/${userId}/suspend`, { reason });
    } catch (error) {
      throw new Error(error.message || "Failed to suspend user");
    }
  },

  // Activate user (admin function)
  async activateUser(userId) {
    try {
      // Mock user activation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "User activated successfully",
            userId,
            status: "active",
            activatedAt: new Date().toISOString(),
          });
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/admin/users/${userId}/activate`);
    } catch (error) {
      throw new Error(error.message || "Failed to activate user");
    }
  },

  // Delete user (admin function)
  async deleteUser(userId, reason) {
    try {
      // Mock user deletion
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "User deleted successfully",
            userId,
            reason,
            deletedAt: new Date().toISOString(),
          });
        }, 600);
      });

      // Uncomment when backend is ready:
      // return await apiService.delete(`/admin/users/${userId}`, { reason });
    } catch (error) {
      throw new Error(error.message || "Failed to delete user");
    }
  },

  // Get user statistics
  async getUserStats(userId) {
    try {
      // Mock user statistics
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            userId,
            totalBookings: 3,
            completedBookings: 2,
            cancelledBookings: 1,
            totalSpent: 275,
            averageRating: 4.8,
            favoriteGuides: 5,
            reviewsGiven: 3,
            accountAge: "8 months",
            lastActivity: "2024-01-20T14:20:00Z",
          });
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/users/${userId}/stats`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user statistics");
    }
  },

  // Search users (admin function)
  async searchUsers(searchParams) {
    try {
      // Mock search results
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Sarah Johnson",
              email: "sarah@email.com",
              userType: "tourist",
              status: "active",
              location: "New York, USA",
              totalBookings: 3,
            },
          ]);
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/admin/users/search', searchParams);
    } catch (error) {
      throw new Error(error.message || "Search failed");
    }
  },

  // Get user activity log (admin function)
  async getUserActivityLog(userId, page = 1, limit = 20) {
    try {
      // Mock activity log
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            activities: [
              {
                id: 1,
                action: "login",
                timestamp: "2024-01-20T14:20:00Z",
                ip: "192.168.1.100",
                userAgent: "Mozilla/5.0...",
              },
              {
                id: 2,
                action: "booking_created",
                timestamp: "2024-01-20T10:15:00Z",
                details: "Booking #TC-2024-001 created",
                ip: "192.168.1.100",
              },
            ],
            total: 25,
            page,
            totalPages: Math.ceil(25 / limit),
          });
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/admin/users/${userId}/activity`, { page, limit });
    } catch (error) {
      throw new Error(error.message || "Failed to fetch activity log");
    }
  },

  // Verify user email
  async verifyEmail(userId, verificationCode) {
    try {
      // Mock email verification
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Email verified successfully",
            userId,
            isVerified: true,
            verifiedAt: new Date().toISOString(),
          });
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/users/${userId}/verify-email`, { verificationCode });
    } catch (error) {
      throw new Error(error.message || "Email verification failed");
    }
  },

  // Resend verification email
  async resendVerificationEmail(userId) {
    try {
      // Mock resend verification
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Verification email sent successfully",
            userId,
          });
        }, 300);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/users/${userId}/resend-verification`);
    } catch (error) {
      throw new Error(error.message || "Failed to resend verification email");
    }
  },
};
