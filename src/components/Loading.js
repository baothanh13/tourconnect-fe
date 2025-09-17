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

  const LoadingComponent = () => (
    <div className={`loading-container ${sizeClasses[size]} ${className}`}>
      <div className="loading-spinner" style={{ borderTopColor: color }}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingComponent />
      </div>
    );
  }

  return <LoadingComponent />;
};

export default Loading;
