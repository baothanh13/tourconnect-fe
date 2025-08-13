import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./Loading"; // Assuming you have a loading component

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while auth state is being checked
    return <Loading overlay text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role is in the list of allowed roles for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the role is not allowed, redirect to an "unauthorized" page or the homepage
    return <Navigate to="/unauthorized" replace />;
  }

  // If everything is fine, render the component for the route
  return <Outlet />;
};

export default ProtectedRoute;
