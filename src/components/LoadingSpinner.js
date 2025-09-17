import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({
  message = "Loading...",
  size = "medium",
  color = "#007bff",
}) => {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  };

  return (
    <div className={`loading-spinner-container ${sizeClasses[size]}`}>
      <div className="loading-spinner" style={{ borderTopColor: color }}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
