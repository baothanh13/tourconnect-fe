import apiService from "./api";

export const bookingsService = {
  // Get all bookings (admin function)
  async getAllBookings(options = {}) {
    try {
      // Mock bookings data
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              touristName: "Sarah Johnson",
              guideName: "Phạm Thị Lan",
              location: "Hoi An, Vietnam",
              date: "2024-01-25",
              status: "confirmed",
              amount: 45,
              createdAt: "2024-01-20T09:15:00Z",
              duration: "4 hours",
              tourType: "Cultural Tour",
            },
            {
              id: 2,
              touristName: "Michael Chen",
              guideName: "Kenji Tanaka",
              location: "Tokyo, Japan",
              date: "2024-01-28",
              status: "pending",
              amount: 85,
              createdAt: "2024-01-19T14:30:00Z",
              duration: "6 hours",
              tourType: "City Tour",
            },
            {
              id: 3,
              touristName: "Emma Wilson",
              guideName: "Marie Dubois",
              location: "Paris, France",
              date: "2024-01-30",
              status: "completed",
              amount: 75,
              createdAt: "2024-01-18T11:45:00Z",
              duration: "5 hours",
              tourType: "Art & Culture",
            },
            {
              id: 4,
              touristName: "David Kim",
              guideName: "Carlos Rodriguez",
              location: "Barcelona, Spain",
              date: "2024-01-22",
              status: "cancelled",
              amount: 65,
              createdAt: "2024-01-17T16:20:00Z",
              duration: "3 hours",
              tourType: "Food Tour",
            },
          ]);
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/admin/bookings', options);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch bookings");
    }
  },

  // Get user bookings (for tourists)
  async getUserBookings(userId) {
    try {
      // Mock user bookings
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              guideId: 1,
              guideName: "Phạm Thị Lan",
              guideImage:
                "https://images.unsplash.com/photo-1494790108755-2616b612b1d4?w=400&h=400&fit=crop&crop=face",
              location: "Hoi An, Vietnam",
              date: "2024-01-25",
              time: "09:00",
              status: "confirmed",
              amount: 45,
              duration: "4 hours",
              tourType: "Cultural Tour",
              specialRequests: "Vegetarian lunch preferred",
              bookingCode: "TC-2024-001",
            },
            {
              id: 2,
              guideId: 2,
              guideName: "Kenji Tanaka",
              guideImage:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
              location: "Tokyo, Japan",
              date: "2024-02-15",
              time: "10:00",
              status: "pending",
              amount: 85,
              duration: "6 hours",
              tourType: "City Tour",
              specialRequests: "Photography focused tour",
              bookingCode: "TC-2024-002",
            },
          ]);
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/bookings/user/${userId}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user bookings");
    }
  },

  // Get guide bookings (for guides)
  async getGuideBookings(guideId) {
    try {
      // Mock guide bookings
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              touristId: 1,
              touristName: "Sarah Johnson",
              touristEmail: "sarah@email.com",
              date: "2024-01-25",
              time: "09:00",
              status: "confirmed",
              amount: 45,
              duration: "4 hours",
              tourType: "Cultural Tour",
              specialRequests: "Vegetarian lunch preferred",
              bookingCode: "TC-2024-001",
              groupSize: 2,
            },
          ]);
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/bookings/guide/${guideId}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch guide bookings");
    }
  },

  // Create new booking
  async createBooking(bookingData) {
    try {
      // Mock booking creation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Booking created successfully",
            bookingId: Date.now(),
            bookingCode: `TC-2024-${String(Date.now()).slice(-3)}`,
            ...bookingData,
            status: "pending",
          });
        }, 1000);
      });

      // Uncomment when backend is ready:
      // return await apiService.post('/bookings', bookingData);
    } catch (error) {
      throw new Error(error.message || "Failed to create booking");
    }
  },

  // Get booking by ID
  async getBookingById(bookingId) {
    try {
      // Mock booking details
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: parseInt(bookingId),
            touristId: 1,
            touristName: "Sarah Johnson",
            touristEmail: "sarah@email.com",
            guideId: 1,
            guideName: "Phạm Thị Lan",
            guideImage:
              "https://images.unsplash.com/photo-1494790108755-2616b612b1d4?w=400&h=400&fit=crop&crop=face",
            location: "Hoi An, Vietnam",
            date: "2024-01-25",
            time: "09:00",
            status: "confirmed",
            amount: 45,
            duration: "4 hours",
            tourType: "Cultural Tour",
            specialRequests: "Vegetarian lunch preferred",
            bookingCode: "TC-2024-001",
            groupSize: 2,
            createdAt: "2024-01-20T09:15:00Z",
            paymentStatus: "paid",
            notes: "Looking forward to exploring Hoi An's culture!",
          });
        }, 300);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/bookings/${bookingId}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking details");
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId, status, reason = "") {
    try {
      // Mock status update
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: `Booking ${status} successfully`,
            bookingId,
            status,
            updatedAt: new Date().toISOString(),
          });
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/bookings/${bookingId}/status`, { status, reason });
    } catch (error) {
      throw new Error(error.message || "Failed to update booking status");
    }
  },

  // Cancel booking
  async cancelBooking(bookingId, reason) {
    try {
      // Mock booking cancellation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Booking cancelled successfully",
            bookingId,
            status: "cancelled",
            reason,
            refundAmount: 40.5, // 90% refund
            refundProcessingTime: "3-5 business days",
          });
        }, 600);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/bookings/${bookingId}/cancel`, { reason });
    } catch (error) {
      throw new Error(error.message || "Failed to cancel booking");
    }
  },

  // Confirm booking (for guides)
  async confirmBooking(bookingId, guideNotes = "") {
    try {
      // Mock booking confirmation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Booking confirmed successfully",
            bookingId,
            status: "confirmed",
            guideNotes,
            confirmedAt: new Date().toISOString(),
          });
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/bookings/${bookingId}/confirm`, { guideNotes });
    } catch (error) {
      throw new Error(error.message || "Failed to confirm booking");
    }
  },

  // Complete booking
  async completeBooking(bookingId, completionData) {
    try {
      // Mock booking completion
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Booking completed successfully",
            bookingId,
            status: "completed",
            completedAt: new Date().toISOString(),
            ...completionData,
          });
        }, 600);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/bookings/${bookingId}/complete`, completionData);
    } catch (error) {
      throw new Error(error.message || "Failed to complete booking");
    }
  },

  // Add review to booking
  async addBookingReview(bookingId, reviewData) {
    try {
      // Mock review addition
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Review added successfully",
            bookingId,
            reviewId: Date.now(),
            ...reviewData,
            createdAt: new Date().toISOString(),
          });
        }, 700);
      });

      // Uncomment when backend is ready:
      // return await apiService.post(`/bookings/${bookingId}/review`, reviewData);
    } catch (error) {
      throw new Error(error.message || "Failed to add review");
    }
  },

  // Get booking statistics
  async getBookingStats(dateRange = {}) {
    try {
      // Mock booking statistics
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalBookings: 1250,
            confirmedBookings: 980,
            pendingBookings: 85,
            cancelledBookings: 185,
            completedBookings: 950,
            totalRevenue: 78500,
            averageBookingValue: 65.5,
            popularLocations: [
              { location: "Paris, France", bookings: 245 },
              { location: "Tokyo, Japan", bookings: 198 },
              { location: "Hoi An, Vietnam", bookings: 156 },
            ],
            monthlyGrowth: 12.5,
          });
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/bookings/stats', dateRange);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch booking statistics");
    }
  },

  // Search bookings
  async searchBookings(searchParams) {
    try {
      // Mock search results
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              touristName: "Sarah Johnson",
              guideName: "Phạm Thị Lan",
              location: "Hoi An, Vietnam",
              date: "2024-01-25",
              status: "confirmed",
              amount: 45,
              bookingCode: "TC-2024-001",
            },
          ]);
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/bookings/search', searchParams);
    } catch (error) {
      throw new Error(error.message || "Search failed");
    }
  },
};
