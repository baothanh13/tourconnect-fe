import React from "react";
import "./Loading.css";

const Loading = ({
  size = "medium",
  color = "#007bff",
  text = "Loading...",
  overlay = false,
  className = "",
}) => {
  const sizeClasses = {
    small: "loading-small",
    medium: "loading-medium",
    large: "loading-large",
  };

  const LoadingSpinner = () => (
    <div className={`loading-container ${sizeClasses[size]} ${className}`}>
      <div className="loading-spinner" style={{ borderTopColor: color }}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner />
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default Loading;
