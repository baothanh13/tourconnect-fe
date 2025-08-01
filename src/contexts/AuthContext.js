// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('tourconnect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('tourconnect_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType = 'tourist') => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // For now, using mock authentication
      const mockUser = {
        id: Date.now(),
        email,
        userType, // 'tourist', 'guide', 'support', 'admin'
        name: email.split('@')[0],
        isVerified: userType === 'guide' ? true : false,
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('tourconnect_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      const newUser = {
        id: Date.now(),
        ...userData,
        isVerified: false,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('tourconnect_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tourconnect_user');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('tourconnect_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isGuide: user?.userType === 'guide',
    isTourist: user?.userType === 'tourist',
    isAdmin: user?.userType === 'admin',
    isSupport: user?.userType === 'support',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
