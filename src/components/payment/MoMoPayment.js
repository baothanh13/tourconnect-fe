import React, { useState } from "react";
import { PaymentService } from "../../services/paymentService";
import {
  FaCreditCard,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./MoMoPayment.css";

const MoMoPayment = ({ booking, onPaymentSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const handleMoMoPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert price to VND (if your booking.total_price is already VND, remove conversion)
      const amountInVND = Math.round(booking.total_price * 24000);

      const paymentData = await PaymentService.createMoMoPayment(
        booking.id,
        amountInVND,
        "VND"
      );

      setPaymentData(paymentData);

      // Redirect to MoMo payment page
      if (paymentData.payUrl) {
        // Store booking info for when user returns
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            bookingId: booking.id,
          })
        );

        // Redirect to MoMo
        window.location.href = paymentData.payUrl;
      } else {
        throw new Error("No payment URL received from MoMo");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate MoMo payment");
      console.error("MoMo payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="momo-payment-container">
      <div className="payment-header">
        <h3>
          <FaCreditCard className="payment-icon" />
          MoMo Payment
        </h3>
        <p>Secure payment with MoMo e-wallet</p>
      </div>

      <div className="payment-details">
        <div className="booking-summary">
          <h4>Booking Summary</h4>
          <div className="summary-row">
            <span>Tour:</span>
            <span>{booking.tour_title}</span>
          </div>
          <div className="summary-row">
            <span>Date:</span>
            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
          </div>
          <div className="summary-row">
            <span>Participants:</span>
            <span>{booking.number_of_tourists} people</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>${booking.total_price}</span>
          </div>
          <div className="summary-row">
            <span>Amount in VND:</span>
            <span>₫{(booking.total_price * 24000).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {paymentData && (
        <div className="success-message">
          <FaCheckCircle />
          <span>Payment initiated successfully! Redirecting to MoMo...</span>
        </div>
      )}

      <div className="payment-actions">
        <button className="btn-cancel" onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button
          className="btn-pay-momo"
          onClick={handleMoMoPayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              Processing...
            </>
          ) : (
            <>
              <FaCreditCard />
              Pay with MoMo
            </>
          )}
        </button>
      </div>

      <div className="payment-info">
        <p>
          <strong>Note:</strong> You will be redirected to MoMo's secure payment
          page. After completing the payment, you will be redirected back to our
          site.
        </p>
      </div>
    </div>
  );
};

export default MoMoPayment;
