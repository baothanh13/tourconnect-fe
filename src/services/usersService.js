// src/services/usersService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // correct base path

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

const usersService = {
  // Login user
  login: async ({ email, password }) => {
    try {
      const response = await apiClient.post("/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await apiClient.post("/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  },

  confirmOTP: async ({ otp, token }) => {
    try {
      const response = await apiClient.post("/confirm-otp", {
        otp,
        token,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "OTP verification failed."
      );
    }
  },

  // Forgot password: send OTP to email
  sendForgotPasswordOTP: async (email) => {
    try {
      const response = await apiClient.post("/forgot-password/send-otp", { email });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send OTP."
      );
    }
  },

  // Forgot password: confirm OTP and set new password
  resetPassword: async ({ otp, token, newPassword }) => {
    try {
      const response = await apiClient.post("/forgot-password/reset", {
        otp,
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password."
      );
    }
  },

  // ... (rest of the file is correct)

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get("/profile");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put("/profile", profileData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post("/logout");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Logout failed.");
    }
  },
};

export default usersService;
