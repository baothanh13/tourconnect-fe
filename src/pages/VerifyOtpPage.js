import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Receive user_id and otpToken from registration redirect
  const { user_id, otpToken } = location.state || {};

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/confirmOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, token: otpToken }), // This matches backend
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "OTP verification failed");
      }
      await res.json();
      alert("OTP verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Enter OTP</h2>
      <p>Please enter the code sent to your email.</p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter your OTP"
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button
        onClick={handleVerifyOtp}
        style={{ width: "100%", padding: "8px" }}
      >
        Verify OTP
      </button>
    </div>
  );
}
