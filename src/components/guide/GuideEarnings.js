import React from "react";
import "./GuideComponents.css";

const GuideEarnings = () => {
  return (
    <div className="guide-earnings">
      <div className="page-header">
        <h1>Earnings & Analytics</h1>
      </div>

      <div className="earnings-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>This Month</h3>
            <p className="amount">$1,250</p>
          </div>
          <div className="stat-card">
            <h3>Total Earnings</h3>
            <p className="amount">$8,500</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="amount">$450</p>
          </div>
        </div>

        <div className="chart-placeholder">
          <p>Earnings chart will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default GuideEarnings;
