import React, { useState } from "react";

const OtpForm = ({ email, onSubmit, isLoading }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setError("");
    onSubmit(otp);
  };

  return (
    <div className="otp-form-container">
      <h3>Verify Your Email</h3>
      <p>
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className="otp-form">
        <div className="form-group">
          <label>Enter OTP Code:</label>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength="6"
            required
            disabled={isLoading}
            className="otp-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="verify-button"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      <div className="otp-help">
        <p>Didn't receive the code? Check your spam folder or try again.</p>
      </div>
    </div>
  );
};

export default OtpForm;
