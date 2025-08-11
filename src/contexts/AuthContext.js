// src/contexts/AuthContext.js
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

  const login = async (email, password, userType) => {
    try {
      setLoading(true);
      const data = await usersService.login({ email, password, userType });

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
        isGuide: user?.userType === "guide",
        isTourist: user?.userType === "tourist",
        isAdmin: user?.userType === "admin",
        isSupport: user?.userType === "support",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
