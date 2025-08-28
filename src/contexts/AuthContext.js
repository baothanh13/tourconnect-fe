import React, { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/usersService";
import apiService from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("tourconnect_user");
    const storedToken = localStorage.getItem("tourconnect_token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);

      // --- FIX #1: Correct the user object on page load ---
      const userWithId = {
        ...parsedUser,
        id: parsedUser.user_id, // Add the 'id' property
      };

      setUser(userWithId);
      setToken(storedToken);

      // Set token in API service
      apiService.setAuthToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await usersService.login({ email, password });

      // --- FIX #2: Correct the user object on login ---
      const userWithId = {
        ...data.user,
        id: data.user.user_id, // Add the 'id' property
      };

      setUser(userWithId);
      setToken(data.token);

      localStorage.setItem("tourconnect_user", JSON.stringify(userWithId));
      localStorage.setItem("tourconnect_token", data.token);

      // Set token in API service
      apiService.setAuthToken(data.token);

      return { success: true, user: userWithId };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await usersService.register(userData);
      return {
        success: true,
        message: data.message,
        otpToken: data.otpToken,
        userId: data.user_id,
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const confirmOTP = async (otpData) => {
    try {
      setLoading(true);
      const data = await usersService.confirmOTP(otpData);
      return {
        success: true,
        message: data.message,
        email: data.email,
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await usersService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("tourconnect_user");
      localStorage.removeItem("tourconnect_token");
    }
  };

  const updateUser = (updatedData) => {
    // Ensure the updated data also has a consistent 'id'
    const updatedUserWithId = {
      ...user,
      ...updatedData,
      id: updatedData.user_id || user.id, // Prioritize new user_id, fallback to existing id
    };
    setUser(updatedUserWithId);
    localStorage.setItem("tourconnect_user", JSON.stringify(updatedUserWithId));
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const data = await usersService.updateProfile(profileData);
      updateUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      const data = await usersService.getProfile();
      updateUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        confirmOTP,
        logout,
        updateUser,
        updateProfile,
        getProfile,
        isGuide: user?.role === "guide",
        isTourist: user?.role === "tourist",
        isAdmin: user?.role === "admin",
        isSupport: user?.role === "support",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
