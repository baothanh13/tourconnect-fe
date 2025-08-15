import React, { createContext, useState, useEffect, useContext } from "react";
import usersService from "../services/usersService";

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
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await usersService.login({ email, password });

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem("tourconnect_user", JSON.stringify(data.user));
      localStorage.setItem("tourconnect_token", data.token);

      return { success: true, user: data.user };
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

      // Registration returns OTP token, not user login
      // User needs to verify OTP before being logged in
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

  const confirmOTP = async (otp, otpToken) => {
    try {
      setLoading(true);
      const data = await usersService.confirmOTP({ otp, token: otpToken });

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
      // Call logout API to invalidate token on server
      await usersService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local state regardless of API response
      setUser(null);
      setToken(null);
      localStorage.removeItem("tourconnect_user");
      localStorage.removeItem("tourconnect_token");
    }
  };
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("tourconnect_user", JSON.stringify(updatedUser));
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const data = await usersService.updateProfile(profileData);

      // Update local user data
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

      // Update local user data
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
