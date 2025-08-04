import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PaymentService from "../../services/paymentService";
import "./PaymentForm.css";

const PaymentForm = ({ bookingData, onPaymentSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [errors, setErrors] = useState({});

  // Payment data states
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [momoData, setMomoData] = useState({
    phoneNumber: "",
  });

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    country: "Vietnam",
  });

  const paymentMethods = PaymentService.getPaymentMethods();

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setErrors({});
    setPaymentStep(2);
  };

  const handleCardInputChange = (field, value) => {
    if (field === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      if (value.length > 19) return;
    }

    if (field === "expiryDate") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
      if (value.length > 5) return;
    }

    if (field === "cvv") {
      value = value.replace(/\D/g, "");
      if (value.length > 4) return;
    }

    setCardData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBillingChange = (field, value) => {
    setBillingData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMomoChange = (field, value) => {
    if (field === "phoneNumber") {
      value = value.replace(/\D/g, "");
      if (value.length > 11) return;
    }

    setMomoData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (paymentStep === 2) {
      if (selectedMethod === "card") {
        if (
          !cardData.cardNumber ||
          cardData.cardNumber.replace(/\s/g, "").length < 16
        ) {
          newErrors.cardNumber = "Valid card number is required";
        } else if (!PaymentService.validateCardNumber(cardData.cardNumber)) {
          newErrors.cardNumber = "Invalid card number";
        }

        if (
          !cardData.expiryDate ||
          !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)
        ) {
          newErrors.expiryDate = "Valid expiry date required (MM/YY)";
        }

        if (!cardData.cvv || cardData.cvv.length < 3) {
          newErrors.cvv = "Valid CVV is required";
        }

        if (
          !cardData.cardholderName ||
          cardData.cardholderName.trim().length < 2
        ) {
          newErrors.cardholderName = "Cardholder name is required";
        }
      }

      if (selectedMethod === "momo") {
        if (
          !momoData.phoneNumber ||
          !/^\d{10,11}$/.test(momoData.phoneNumber)
        ) {
          newErrors.phoneNumber = "Valid phone number is required";
        }
      }
    }

    if (paymentStep === 3) {
      if (!billingData.firstName)
        newErrors.firstName = "First name is required";
      if (!billingData.lastName) newErrors.lastName = "Last name is required";
      if (!billingData.email || !/\S+@\S+\.\S+/.test(billingData.email)) {
        newErrors.email = "Valid email is required";
      }
      if (!billingData.address) newErrors.address = "Address is required";
      if (!billingData.city) newErrors.city = "City is required";
      if (!billingData.postalCode)
        newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setPaymentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setPaymentStep((prev) => prev - 1);
    setErrors({});
  };

  const handlePayment = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      let paymentData = {
        amount: bookingData.totalPrice,
        method: selectedMethod,
        billingAddress: billingData,
        bookingId: bookingData.id,
      };

      let result;

      if (selectedMethod === "card") {
        paymentData = {
          ...paymentData,
          cardNumber: cardData.cardNumber.replace(/\s/g, ""),
          expiryDate: cardData.expiryDate,
          cvv: cardData.cvv,
          cardholderName: cardData.cardholderName,
        };
        result = await PaymentService.processPayment(paymentData);
      } else if (selectedMethod === "momo") {
        result = await PaymentService.processMoMoPayment({
          ...momoData,
          amount: bookingData.totalPrice,
        });
      } else {
        result = await PaymentService.processPayment(paymentData);
      }

      if (result.success) {
        onPaymentSuccess(result);
      } else {
        setErrors({
          general: result.error || "Payment failed. Please try again.",
        });
      }
    } catch (error) {
      setErrors({
        general: error.message || "Payment failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCardType = (cardNumber) => {
    return PaymentService.getCardType(cardNumber);
  };

  const calculateFees = () => {
    return PaymentService.calculateFees(bookingData.totalPrice, selectedMethod);
  };

  const renderMethodSelection = () => (
    <div className="payment-step">
      <h3>Select Payment Method</h3>
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`payment-method ${
              selectedMethod === method.id ? "selected" : ""
            }`}
            onClick={() => handleMethodSelect(method.id)}
          >
            <div className="method-icon">{method.icon}</div>
            <div className="method-info">
              <div className="method-name">{method.name}</div>
              <div className="method-description">{method.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => {
    if (selectedMethod === "card") {
      return (
        <div className="payment-step">
          <h3>Card Information</h3>
          <div className="card-form">
            <div className="form-group">
              <label>Card Number</label>
              <div className="card-input-wrapper">
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) =>
                    handleCardInputChange("cardNumber", e.target.value)
                  }
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? "error" : ""}
                />
                {cardData.cardNumber && (
                  <span className="card-type">
                    {getCardType(cardData.cardNumber)}
                  </span>
                )}
              </div>
              {errors.cardNumber && (
                <span className="error-text">{errors.cardNumber}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  value={cardData.expiryDate}
                  onChange={(e) =>
                    handleCardInputChange("expiryDate", e.target.value)
                  }
                  placeholder="MM/YY"
                  className={errors.expiryDate ? "error" : ""}
                />
                {errors.expiryDate && (
                  <span className="error-text">{errors.expiryDate}</span>
                )}
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange("cvv", e.target.value)}
                  placeholder="123"
                  className={errors.cvv ? "error" : ""}
                />
                {errors.cvv && <span className="error-text">{errors.cvv}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                value={cardData.cardholderName}
                onChange={(e) =>
                  handleCardInputChange("cardholderName", e.target.value)
                }
                placeholder="John Doe"
                className={errors.cardholderName ? "error" : ""}
              />
              {errors.cardholderName && (
                <span className="error-text">{errors.cardholderName}</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (selectedMethod === "momo") {
      return (
        <div className="payment-step">
          <h3>MoMo Payment</h3>
          <div className="momo-form">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={momoData.phoneNumber}
                onChange={(e) =>
                  handleMomoChange("phoneNumber", e.target.value)
                }
                placeholder="0123456789"
                className={errors.phoneNumber ? "error" : ""}
              />
              {errors.phoneNumber && (
                <span className="error-text">{errors.phoneNumber}</span>
              )}
            </div>
            <div className="momo-info">
              <p>
                📱 You will be redirected to MoMo app to complete the payment
              </p>
              <p>💳 Or scan the QR code with your MoMo app</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="payment-step">
        <h3>
          {paymentMethods.find((m) => m.id === selectedMethod)?.name} Payment
        </h3>
        <div className="payment-info">
          <p>
            You will be redirected to complete your payment with{" "}
            {paymentMethods.find((m) => m.id === selectedMethod)?.name}.
          </p>
        </div>
      </div>
    );
  };

  const renderBillingAddress = () => (
    <div className="payment-step">
      <h3>Billing Address</h3>
      <div className="billing-form">
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={billingData.firstName}
              onChange={(e) => handleBillingChange("firstName", e.target.value)}
              className={errors.firstName ? "error" : ""}
            />
            {errors.firstName && (
              <span className="error-text">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={billingData.lastName}
              onChange={(e) => handleBillingChange("lastName", e.target.value)}
              className={errors.lastName ? "error" : ""}
            />
            {errors.lastName && (
              <span className="error-text">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={billingData.email}
            onChange={(e) => handleBillingChange("email", e.target.value)}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={billingData.address}
            onChange={(e) => handleBillingChange("address", e.target.value)}
            className={errors.address ? "error" : ""}
          />
          {errors.address && (
            <span className="error-text">{errors.address}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={billingData.city}
              onChange={(e) => handleBillingChange("city", e.target.value)}
              className={errors.city ? "error" : ""}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              value={billingData.postalCode}
              onChange={(e) =>
                handleBillingChange("postalCode", e.target.value)
              }
              className={errors.postalCode ? "error" : ""}
            />
            {errors.postalCode && (
              <span className="error-text">{errors.postalCode}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Country</label>
          <select
            value={billingData.country}
            onChange={(e) => handleBillingChange("country", e.target.value)}
          >
            <option value="Vietnam">Vietnam</option>
            <option value="Thailand">Thailand</option>
            <option value="Singapore">Singapore</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const fees = calculateFees();

    return (
      <div className="payment-step">
        <h3>Payment Confirmation</h3>

        <div className="confirmation-summary">
          <div className="booking-summary">
            <h4>Booking Details</h4>
            <div className="summary-item">
              <span>Tour:</span>
              <span>{bookingData.tourTitle}</span>
            </div>
            <div className="summary-item">
              <span>Date:</span>
              <span>{bookingData.date}</span>
            </div>
            <div className="summary-item">
              <span>Participants:</span>
              <span>{bookingData.participants}</span>
            </div>
          </div>

          <div className="payment-summary">
            <h4>Payment Method</h4>
            <div className="selected-method">
              <span>
                {paymentMethods.find((m) => m.id === selectedMethod)?.icon}
              </span>
              <span>
                {paymentMethods.find((m) => m.id === selectedMethod)?.name}
              </span>
              {selectedMethod === "card" && (
                <span>**** **** **** {cardData.cardNumber.slice(-4)}</span>
              )}
            </div>
          </div>

          <div className="cost-breakdown">
            <h4>Cost Breakdown</h4>
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${fees.subtotal}</span>
            </div>
            <div className="summary-item">
              <span>Service Fee ({fees.feeRate}%):</span>
              <span>${fees.serviceFee}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${fees.total}</span>
            </div>
          </div>

          <div className="terms-acceptance">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>
                I agree to the terms and conditions and privacy policy
              </span>
            </label>
          </div>
        </div>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}
      </div>
    );
  };

  return (
    <div className="payment-form">
      <div className="payment-header">
        <h2>Complete Your Payment</h2>
        <div className="payment-steps">
          <div
            className={`step ${paymentStep >= 1 ? "active" : ""} ${
              paymentStep > 1 ? "completed" : ""
            }`}
          >
            <span>1</span>
            <label>Method</label>
          </div>
          <div
            className={`step ${paymentStep >= 2 ? "active" : ""} ${
              paymentStep > 2 ? "completed" : ""
            }`}
          >
            <span>2</span>
            <label>Details</label>
          </div>
          <div
            className={`step ${paymentStep >= 3 ? "active" : ""} ${
              paymentStep > 3 ? "completed" : ""
            }`}
          >
            <span>3</span>
            <label>Billing</label>
          </div>
          <div className={`step ${paymentStep >= 4 ? "active" : ""}`}>
            <span>4</span>
            <label>Confirm</label>
          </div>
        </div>
      </div>

      <div className="payment-content">
        {paymentStep === 1 && renderMethodSelection()}
        {paymentStep === 2 && renderPaymentDetails()}
        {paymentStep === 3 && renderBillingAddress()}
        {paymentStep === 4 && renderConfirmation()}
      </div>

      <div className="payment-actions">
        {paymentStep > 1 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePreviousStep}
            disabled={loading}
          >
            Previous
          </button>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        {paymentStep < 4 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={handleNextStep}
            disabled={loading || !selectedMethod}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary payment-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${calculateFees().total}`}
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
