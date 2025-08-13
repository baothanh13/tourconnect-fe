// src/services/usersService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth"; // correct base path

const usersService = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
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
};

export default usersService;
