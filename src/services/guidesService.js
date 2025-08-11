import apiService from "./api";
import { mockGuides } from "../data/mockData";

export const guidesService = {
  // Get guide by user ID (for dashboard)
  async getGuideByUserId(userId) {
    try {
      const response = await apiService.get(`/guides/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching guide by user ID:", error);
      // Return mock data as fallback
      return {
        id: "mock-guide-1",
        user_id: userId,
        name: "Sample Guide",
        location: "Ho Chi Minh City",
        languages: ["Vietnamese", "English"],
        specialties: ["Cultural Tours", "Food Tours"],
        price_per_hour: 25,
        experience_years: 3,
        description: "Experienced local guide",
        rating: 4.5,
        total_reviews: 42,
        is_available: 1,
        verification_status: "verified",
      };
    }
  },

  // Get all guides with filters
  async getGuides(filters = {}) {
    try {
      // Use mockGuides data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          // Ensure all guides have the required properties for GuideCard
          const enrichedGuides = mockGuides.map((guide) => ({
            ...guide,
            // Keep original avatar/image
            avatar:
              guide.avatar ||
              "https://placehold.co/300x300/EFEFEFF/333333?text=" +
                guide.name.charAt(0),
            // Ensure bio exists for GuideCard
            bio:
              guide.bio ||
              guide.description ||
              `Local guide with ${
                guide.experienceYears || 3
              }+ years experience`,
            // Additional properties for other components that might need them
            price: guide.pricePerHour || guide.price || 25,
            reviews: guide.totalReviews || guide.reviews || 0,
            availability: guide.isAvailable
              ? "Available today"
              : "Available tomorrow",
            image:
              guide.avatar ||
              "https://placehold.co/300x300/EFEFEFF/333333?text=" +
                guide.name.charAt(0),
            responseTime: "within 1 hour",
            description:
              guide.bio ||
              guide.description ||
              `Local guide with ${
                guide.experienceYears || 3
              }+ years experience`,
            tours: Math.floor(Math.random() * 100) + 20,
            joinedDate: guide.joinedDate || "2020-01-01",
          }));

          resolve(enrichedGuides);
        }, 500);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/guides', filters);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch guides");
    }
  },

  // Get all guides (admin function)
  async getAllGuides(options = {}) {
    try {
      // Mock data including unverified guides
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Phạm Thị Lan",
              email: "lan.pham@email.com",
              location: "Hoi An, Vietnam",
              rating: 4.9,
              reviews: 127,
              price: 45,
              isVerified: true,
              status: "active",
              createdAt: "2020-03-15T10:30:00Z",
              lastLoginAt: "2024-01-20T14:20:00Z",
              userType: "guide",
            },
            {
              id: 4,
              name: "Carlos Rodriguez",
              email: "carlos@email.com",
              location: "Barcelona, Spain",
              rating: 4.7,
              reviews: 98,
              price: 65,
              isVerified: false,
              status: "pending",
              createdAt: "2024-01-18T09:15:00Z",
              lastLoginAt: null,
              userType: "guide",
            },
            {
              id: 5,
              name: "Lisa Anderson",
              email: "lisa@email.com",
              location: "New York, USA",
              rating: 4.8,
              reviews: 156,
              price: 95,
              isVerified: true,
              status: "active",
              createdAt: "2019-11-22T16:45:00Z",
              lastLoginAt: "2024-01-19T11:30:00Z",
              userType: "guide",
            },
          ]);
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/admin/guides', options);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch all guides");
    }
  },

  // Get guide by ID
  async getGuideById(id) {
    try {
      // Mock guide details
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: parseInt(id),
            name: "Phạm Thị Lan",
            location: "Hoi An, Vietnam",
            rating: 4.9,
            reviews: 127,
            price: 45,
            languages: ["Vietnamese", "English", "Chinese"],
            specialties: ["Cultural Tours", "Food Tours", "Historical Sites"],
            availability: "Available today",
            image:
              "https://images.unsplash.com/photo-1494790108755-2616b612b1d4?w=400&h=400&fit=crop&crop=face",
            isVerified: true,
            responseTime: "within 1 hour",
            description:
              "Local expert with 5+ years experience showing the authentic side of Hoi An",
            tours: 89,
            joinedDate: "2020-03-15",
            about:
              "I'm a passionate local guide who loves sharing the rich culture and history of Hoi An with visitors from around the world.",
            experience: "5+ years",
            certifications: ["Licensed Tour Guide", "First Aid Certified"],
            gallery: [
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
              "https://images.unsplash.com/photo-1539650116574-75c0c6d72ddc?w=600&h=400&fit=crop",
            ],
          });
        }, 300);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/guides/${id}`);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch guide details");
    }
  },

  // Search guides
  async searchGuides(searchParams) {
    try {
      // Use mockGuides data for search
      return new Promise((resolve) => {
        setTimeout(() => {
          // Enrich mockGuides data for search results with GuideCard compatibility
          const enrichedGuides = mockGuides.map((guide) => ({
            ...guide,
            // Keep original avatar/image
            avatar:
              guide.avatar ||
              "https://placehold.co/300x300/EFEFEFF/333333?text=" +
                guide.name.charAt(0),
            // Ensure bio exists for GuideCard
            bio:
              guide.bio ||
              guide.description ||
              `Local guide with ${
                guide.experienceYears || 3
              }+ years experience`,
            // Additional properties for other components
            price: guide.pricePerHour || guide.price || 25,
            reviews: guide.totalReviews || guide.reviews || 0,
            availability: guide.isAvailable
              ? "Available today"
              : "Available tomorrow",
            image:
              guide.avatar ||
              "https://placehold.co/300x300/EFEFEFF/333333?text=" +
                guide.name.charAt(0),
            responseTime: "within 1 hour",
            description:
              guide.bio ||
              guide.description ||
              `Local guide with ${
                guide.experienceYears || 3
              }+ years experience`,
            tours: Math.floor(Math.random() * 100) + 20,
            joinedDate: guide.joinedDate || "2020-01-01",
          }));

          // Apply basic search filtering if query is provided
          if (searchParams.query) {
            const filtered = enrichedGuides.filter(
              (guide) =>
                guide.name
                  .toLowerCase()
                  .includes(searchParams.query.toLowerCase()) ||
                guide.location
                  .toLowerCase()
                  .includes(searchParams.query.toLowerCase()) ||
                guide.specialties.some((spec) =>
                  spec.toLowerCase().includes(searchParams.query.toLowerCase())
                )
            );
            resolve(filtered);
          } else {
            resolve(enrichedGuides);
          }
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get('/guides/search', searchParams);
    } catch (error) {
      throw new Error(error.message || "Search failed");
    }
  },

  // Create guide profile (for guides)
  async createGuideProfile(guideData) {
    try {
      // Mock guide creation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Guide profile created successfully",
            guideId: Date.now(),
            ...guideData,
          });
        }, 1000);
      });

      // Uncomment when backend is ready:
      // return await apiService.post('/guides', guideData);
    } catch (error) {
      throw new Error(error.message || "Failed to create guide profile");
    }
  },

  // Update guide profile
  async updateGuideProfile(id, guideData) {
    try {
      // Mock guide update
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Guide profile updated successfully",
            guideId: id,
            ...guideData,
          });
        }, 800);
      });

      // Uncomment when backend is ready:
      // return await apiService.put(`/guides/${id}`, guideData);
    } catch (error) {
      throw new Error(error.message || "Failed to update guide profile");
    }
  },

  // Upload guide images
  async uploadGuideImages(guideId, images) {
    try {
      // Mock image upload
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Images uploaded successfully",
            guideId,
            imageUrls: images.map(
              () => `https://images.unsplash.com/photo-${Date.now()}`
            ),
          });
        }, 1500);
      });

      // Uncomment when backend is ready:
      // const uploadPromises = images.map(image =>
      //   apiService.uploadFile(`/guides/${guideId}/images`, image)
      // );
      // return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(error.message || "Failed to upload images");
    }
  },

  // Get guide reviews
  async getGuideReviews(guideId, page = 1, limit = 10) {
    try {
      // Mock reviews
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            reviews: [
              {
                id: 1,
                userId: 1,
                userName: "John Smith",
                rating: 5,
                comment: "Amazing tour! Lan showed us hidden gems in Hoi An.",
                date: "2024-01-15T10:30:00Z",
              },
            ],
            total: 127,
            page,
            totalPages: Math.ceil(127 / limit),
          });
        }, 300);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/guides/${guideId}/reviews`, { page, limit });
    } catch (error) {
      throw new Error(error.message || "Failed to fetch reviews");
    }
  },

  // Get guide availability
  async getGuideAvailability(guideId, startDate, endDate) {
    try {
      // Mock availability
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            guideId,
            availableDates: ["2024-01-25", "2024-01-26", "2024-01-28"],
            unavailableDates: ["2024-01-27"],
          });
        }, 400);
      });

      // Uncomment when backend is ready:
      // return await apiService.get(`/guides/${guideId}/availability`, {
      //   startDate,
      //   endDate,
      // });
    } catch (error) {
      throw new Error(error.message || "Failed to fetch availability");
    }
  },
};
