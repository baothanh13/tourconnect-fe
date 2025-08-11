// src/services/usersService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // correct base path

const usersService = {
  login: async ({ email, password, userType }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
        userType,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  },
  // Thêm hàm mới này vào bên trong object usersService
  verifyOtp: async (otpData) => {
    try {
      // Gọi đến endpoint POST /api/auth/confirm-otp
      const response = await axios.post("/auth/confirm-otp", otpData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default usersService;
