import React, { useState } from "react";
import { PaymentService } from "../../services/paymentService";
import {
  FaCreditCard,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaMobile,
  FaTimes,
} from "react-icons/fa";
import "./MoMoPayment.css";

const MoMoPayment = ({ booking, onPaymentSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("momo");
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
            paymentId: paymentData.id,
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

  const handleCashPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For cash payment, we just mark the booking as "cash_pending"
      // This would need to be implemented in your backend
      // For now, we'll simulate success
      setTimeout(() => {
        onPaymentSuccess("cash");
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to process cash payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    if (selectedPaymentMethod === "momo") {
      handleMoMoPayment();
    } else {
      handleCashPayment();
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-container">
        {/* Header */}
        <div className="payment-header">
          <h3>Make Payment</h3>
          <button className="close-btn" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        {/* Main Content */}
        <div className="payment-content">
          {/* Booking Summary - Compact */}
          <div className="booking-summary-compact">
            <div className="summary-item">
              <span>Participants:</span>
              <span>{booking.number_of_tourists || 1} people</span>
            </div>
            <div className="summary-item total-amount">
              <span>Total Amount:</span>
              <span>${booking.total_price}</span>
            </div>
            <div className="summary-item vnd-amount">
              <span>Amount in VND:</span>
              <span>₫{(booking.total_price * 24000).toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-methods">
            <div className="method-tabs">
              <button
                className={`method-tab ${
                  selectedPaymentMethod === "momo" ? "active" : ""
                }`}
                onClick={() => setSelectedPaymentMethod("momo")}
              >
                <FaMobile />
                MoMo
              </button>
              <button
                className={`method-tab ${
                  selectedPaymentMethod === "cash" ? "active" : ""
                }`}
                onClick={() => setSelectedPaymentMethod("cash")}
              >
                <FaMoneyBillWave />
                Direct Payment
              </button>
            </div>

            {/* Payment Method Details */}
            <div className="payment-method-details">
              {selectedPaymentMethod === "momo" ? (
                <div className="momo-details">
                  <div className="method-info">
                    <FaMobile className="method-icon momo" />
                    <div>
                      <h4>MoMo E-Wallet</h4>
                      <p>Secure online payment</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="cash-details">
                  <div className="method-info">
                    <FaMoneyBillWave className="method-icon cash" />
                    <div>
                      <h4>Direct Payment</h4>
                      <p>Pay directly to your guide</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}

          {/* Success Display */}
          {paymentData && (
            <div className="success-message">
              <FaCheckCircle />
              <span>
                Payment initiated successfully! Redirecting to MoMo...
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="payment-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn-pay"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Processing...
              </>
            ) : selectedPaymentMethod === "momo" ? (
              <>
                <FaCreditCard />
                Pay with MoMo
              </>
            ) : (
              <>
                <FaMoneyBillWave />
                Confirm Cash Payment
              </>
            )}
          </button>
        </div>

        {/* Payment Note */}
        <div className="payment-note">
          {selectedPaymentMethod === "momo" ? (
            <p>
              <strong>Note:</strong> You will be redirected to MoMo's secure
              payment page. After completing the payment, you will be redirected
              back to our site.
            </p>
          ) : (
            <p>
              <strong>Note:</strong> Please bring exact cash amount and pay
              directly to your guide at the meeting point.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoMoPayment;
