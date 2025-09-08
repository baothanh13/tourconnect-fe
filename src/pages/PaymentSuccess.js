import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentService } from "../services/paymentService";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get booking info from localStorage
        const pendingPayment = localStorage.getItem("pendingPayment");

        if (!pendingPayment) {
          setError("No payment information found");
          setPaymentStatus("error");
          return;
        }

        const paymentInfo = JSON.parse(pendingPayment);

        // Get booking payment status from backend
        const statusData = await PaymentService.getPaymentStatus(
          paymentInfo.bookingId
        );

        const booking = statusData.booking;

        if (booking?.payment_status === "paid") {
          setPaymentStatus("success");
          setPaymentDetails(booking);

          // Clear pending payment from localStorage
          localStorage.removeItem("pendingPayment");
        } else if (booking?.payment_status === "pending") {
          setPaymentStatus("pending");
          setPaymentDetails(booking);
        } else {
          setPaymentStatus("failed");
          setError("Payment failed or cancelled");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.message || "Failed to verify payment status");
        setPaymentStatus("error");
      }
    };

    verifyPayment();
  }, []);

  const handleBackToBookings = () => {
    navigate("/tourist/dashboard");
  };

  const handleRetryPayment = () => {
    navigate(-1); // Go back to previous page
  };

  if (paymentStatus === "loading") {
    return (
      <div className="payment-result-container">
        <div className="payment-result-card">
          <div className="loading-state">
            <FaSpinner className="spinner large" />
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment with MoMo.</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="payment-result-container">
        <div className="payment-result-card">
          <div className="success-state">
            <FaCheckCircle className="status-icon success" />
            <h2>Payment Successful!</h2>
            <p>Your tour booking has been confirmed and paid successfully.</p>

            {paymentDetails && (
              <div className="payment-details">
                <h3>Payment Details</h3>
                <div className="detail-row">
                  <span>Booking ID:</span>
                  <span>{paymentDetails.id}</span>
                </div>
                <div className="detail-row">
                  <span>Amount:</span>
                  <span>₫{paymentDetails.total_price?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className="status-badge success">
                    {paymentDetails.payment_status.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="btn-primary" onClick={handleBackToBookings}>
                <FaArrowLeft />
                Back to My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        <div className="error-state">
          <FaExclamationTriangle className="status-icon error" />
          <h2>Payment {paymentStatus === "failed" ? "Failed" : "Error"}</h2>
          <p>{error || "There was an issue processing your payment."}</p>

          <div className="action-buttons">
            <button className="btn-secondary" onClick={handleBackToBookings}>
              <FaArrowLeft />
              Back to Bookings
            </button>
            <button className="btn-primary" onClick={handleRetryPayment}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
