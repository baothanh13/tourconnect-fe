import React, { createContext, useState, useEffect, useContext } from "react";
// 1. Change this line to a default import (remove the curly braces)
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
      // This will now work correctly
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
      // This will now work correctly
      const data = await usersService.register(userData);

      // A typical registration flow does not log the user in automatically,
      // so we might not set the user/token here until after OTP verification.
      // For now, we'll keep it simple.
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

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("tourconnect_user");
    localStorage.removeItem("tourconnect_token");
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("tourconnect_user", JSON.stringify(updatedUser));
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
        logout,
        updateUser,
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
