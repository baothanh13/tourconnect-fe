import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PaymentService from "../../services/paymentService";
import "./PaymentForm.css";

const PaymentForm = ({
  bookingData,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("card");

  // Enhanced payment methods including Momo
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "momo",
      name: "MoMo Wallet",
      icon: "📱",
      description: "Pay with MoMo e-wallet",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "🅿️",
      description: "Pay with your PayPal account",
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: "🏦",
      description: "Direct bank transfer",
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: "🍎",
      description: "Pay with Apple Pay",
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: "🔵",
      description: "Pay with Google Pay",
    },
  ];

  // Card form state
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: user?.name || "",
    focus: "",
  });

  // MoMo payment state
  const [momoData, setMomoData] = useState({
    phoneNumber: "",
    amount: bookingData?.amount || 0,
  });

  // Billing address state
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Vietnam",
  });

  const [errors, setErrors] = useState({});
  const [paymentStep, setPaymentStep] = useState(1); // 1: Method, 2: Details, 3: Confirmation
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const validateCardData = () => {
    const newErrors = {};

    if (
      !cardData.cardNumber ||
      cardData.cardNumber.replace(/\s/g, "").length < 16
    ) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = "Please enter the cardholder name";
    }

    if (!billingAddress.street.trim()) {
      newErrors.street = "Please enter your street address";
    }

    if (!billingAddress.city.trim()) {
      newErrors.city = "Please enter your city";
    }

    if (!billingAddress.zipCode.trim()) {
      newErrors.zipCode = "Please enter your zip code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMomoData = () => {
    const newErrors = {};

    if (!momoData.phoneNumber || !/^[0-9]{10,11}$/.test(momoData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
    }

    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMomoInputChange = (e) => {
    const { name, value } = e.target;
    setMomoData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setErrors({});
  };

  const proceedToNextStep = () => {
    if (paymentStep === 1) {
      setPaymentStep(2);
    } else if (paymentStep === 2) {
      // Validate based on selected method
      let isValid = false;

      if (selectedMethod === "card") {
        isValid = validateCardData();
      } else if (selectedMethod === "momo") {
        isValid = validateMomoData();
      } else {
        isValid = true; // For other methods, skip validation for now
      }

      if (isValid) {
        setPaymentStep(3);
      }
    }
  };

  const handlePayment = async () => {
    if (!agreementAccepted) {
      setErrors({ agreement: "Please accept the terms and conditions" });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      let paymentData;

      switch (selectedMethod) {
        case "card":
          paymentData = {
            method: "card",
            card: {
              number: cardData.cardNumber.replace(/\s/g, ""),
              expiry: cardData.expiryDate,
              cvv: cardData.cvv,
              name: cardData.cardholderName,
            },
            billing: billingAddress,
            amount: bookingData.amount,
            currency: "USD",
            bookingId: bookingData.id,
          };
          break;

        case "momo":
          paymentData = {
            method: "momo",
            momo: {
              phoneNumber: momoData.phoneNumber,
              amount: bookingData.amount,
            },
            bookingId: bookingData.id,
          };
          break;

        case "paypal":
          paymentData = {
            method: "paypal",
            amount: bookingData.amount,
            currency: "USD",
            bookingId: bookingData.id,
          };
          break;

        default:
          paymentData = {
            method: selectedMethod,
            amount: bookingData.amount,
            bookingId: bookingData.id,
          };
      }

      const result = await PaymentService.processPayment(paymentData);

      if (result.success) {
        onPaymentSuccess({
          paymentId: result.paymentId,
          transactionId: result.transactionId,
          method: selectedMethod,
          amount: bookingData.amount,
          status: "completed",
        });
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        payment: error.message || "Payment failed. Please try again.",
      });
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodIcon = (methodId) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    return method ? method.icon : "💳";
  };

  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, "");
    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    return "Card";
  };

  return (
    <div className="payment-form">
      <div className="payment-header">
        <h2>Secure Payment</h2>
        <div className="payment-steps">
          <div className={`step ${paymentStep >= 1 ? "active" : ""}`}>
            1. Method
          </div>
          <div className={`step ${paymentStep >= 2 ? "active" : ""}`}>
            2. Details
          </div>
          <div className={`step ${paymentStep >= 3 ? "active" : ""}`}>
            3. Confirm
          </div>
        </div>
      </div>

      {/* Step 1: Payment Method Selection */}
      {paymentStep === 1 && (
        <div className="payment-step">
          <h3>Choose Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method ${
                  selectedMethod === method.id ? "selected" : ""
                }`}
                onClick={() => handlePaymentMethodSelect(method.id)}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <div className="method-name">{method.name}</div>
                  <div className="method-description">{method.description}</div>
                </div>
                <div className="method-radio">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="step-actions">
            <button onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={proceedToNextStep} className="btn btn-primary">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment Details */}
      {paymentStep === 2 && (
        <div className="payment-step">
          <h3>Payment Details</h3>

          {selectedMethod === "card" && (
            <div className="card-form">
              <div className="card-preview">
                <div className={`card-display ${cardData.focus}`}>
                  <div className="card-number">
                    {cardData.cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-info">
                    <div className="card-name">
                      {cardData.cardholderName || "CARDHOLDER NAME"}
                    </div>
                    <div className="card-expiry">
                      {cardData.expiryDate || "MM/YY"}
                    </div>
                  </div>
                  <div className="card-type">
                    {getCardType(cardData.cardNumber)}
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    onFocus={() =>
                      setCardData((prev) => ({ ...prev, focus: "number" }))
                    }
                    onBlur={() =>
                      setCardData((prev) => ({ ...prev, focus: "" }))
                    }
                    className={errors.cardNumber ? "error" : ""}
                  />
                  {errors.cardNumber && (
                    <span className="error-text">{errors.cardNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="JOHN DOE"
                    value={cardData.cardholderName}
                    onChange={handleCardInputChange}
                    onFocus={() =>
                      setCardData((prev) => ({ ...prev, focus: "name" }))
                    }
                    onBlur={() =>
                      setCardData((prev) => ({ ...prev, focus: "" }))
                    }
                    className={errors.cardholderName ? "error" : ""}
                  />
                  {errors.cardholderName && (
                    <span className="error-text">{errors.cardholderName}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={handleCardInputChange}
                      onFocus={() =>
                        setCardData((prev) => ({ ...prev, focus: "expiry" }))
                      }
                      onBlur={() =>
                        setCardData((prev) => ({ ...prev, focus: "" }))
                      }
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
                      name="cvv"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      onFocus={() =>
                        setCardData((prev) => ({ ...prev, focus: "cvv" }))
                      }
                      onBlur={() =>
                        setCardData((prev) => ({ ...prev, focus: "" }))
                      }
                      className={errors.cvv ? "error" : ""}
                    />
                    {errors.cvv && (
                      <span className="error-text">{errors.cvv}</span>
                    )}
                  </div>
                </div>
              </div>

              <h4>Billing Address</h4>
              <div className="billing-form">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    placeholder="123 Main Street"
                    value={billingAddress.street}
                    onChange={handleBillingChange}
                    className={errors.street ? "error" : ""}
                  />
                  {errors.street && (
                    <span className="error-text">{errors.street}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={billingAddress.city}
                      onChange={handleBillingChange}
                      className={errors.city ? "error" : ""}
                    />
                    {errors.city && (
                      <span className="error-text">{errors.city}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="12345"
                      value={billingAddress.zipCode}
                      onChange={handleBillingChange}
                      className={errors.zipCode ? "error" : ""}
                    />
                    {errors.zipCode && (
                      <span className="error-text">{errors.zipCode}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={billingAddress.country}
                    onChange={handleBillingChange}
                  >
                    <option value="Vietnam">Vietnam</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === "momo" && (
            <div className="momo-form">
              <div className="momo-info">
                <div className="momo-logo">📱</div>
                <h4>MoMo Wallet Payment</h4>
                <p>Enter your MoMo phone number to proceed with payment</p>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="0901234567"
                  value={momoData.phoneNumber}
                  onChange={handleMomoInputChange}
                  className={errors.phoneNumber ? "error" : ""}
                />
                {errors.phoneNumber && (
                  <span className="error-text">{errors.phoneNumber}</span>
                )}
              </div>

              <div className="payment-amount">
                <label>Amount to Pay</label>
                <div className="amount-display">
                  ${bookingData?.amount || 0}
                </div>
              </div>
            </div>
          )}

          {!["card", "momo"].includes(selectedMethod) && (
            <div className="other-payment-info">
              <div className="payment-icon">
                {getPaymentMethodIcon(selectedMethod)}
              </div>
              <h4>
                {paymentMethods.find((m) => m.id === selectedMethod)?.name}
              </h4>
              <p>You will be redirected to complete your payment securely.</p>
              <div className="amount-display">
                Amount: ${bookingData?.amount || 0}
              </div>
            </div>
          )}

          <div className="step-actions">
            <button
              onClick={() => setPaymentStep(1)}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button onClick={proceedToNextStep} className="btn btn-primary">
              Review Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment Confirmation */}
      {paymentStep === 3 && (
        <div className="payment-step">
          <h3>Confirm Payment</h3>

          <div className="payment-summary">
            <div className="booking-summary">
              <h4>Booking Details</h4>
              <div className="summary-item">
                <span>Guide:</span>
                <span>{bookingData?.guideName}</span>
              </div>
              <div className="summary-item">
                <span>Location:</span>
                <span>{bookingData?.location}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{bookingData?.date}</span>
              </div>
              <div className="summary-item">
                <span>Duration:</span>
                <span>{bookingData?.duration}</span>
              </div>
            </div>

            <div className="payment-summary-details">
              <h4>Payment Summary</h4>
              <div className="summary-item">
                <span>Payment Method:</span>
                <span>
                  {getPaymentMethodIcon(selectedMethod)}{" "}
                  {paymentMethods.find((m) => m.id === selectedMethod)?.name}
                </span>
              </div>
              {selectedMethod === "card" && (
                <div className="summary-item">
                  <span>Card:</span>
                  <span>**** **** **** {cardData.cardNumber.slice(-4)}</span>
                </div>
              )}
              {selectedMethod === "momo" && (
                <div className="summary-item">
                  <span>Phone:</span>
                  <span>{momoData.phoneNumber}</span>
                </div>
              )}
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>${bookingData?.amount}</span>
              </div>
            </div>
          </div>

          <div className="agreement-section">
            <label className="agreement-checkbox">
              <input
                type="checkbox"
                checked={agreementAccepted}
                onChange={(e) => setAgreementAccepted(e.target.checked)}
              />
              <span>
                I agree to the{" "}
                <a href="/terms" target="_blank">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreement && (
              <span className="error-text">{errors.agreement}</span>
            )}
          </div>

          {errors.payment && (
            <div className="payment-error">
              <span className="error-text">{errors.payment}</span>
            </div>
          )}

          <div className="step-actions">
            <button
              onClick={() => setPaymentStep(2)}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={loading || !agreementAccepted}
              className="btn btn-primary btn-large"
            >
              {loading ? "Processing..." : `Pay $${bookingData?.amount}`}
            </button>
          </div>
        </div>
      )}

      <div className="security-info">
        <div className="security-icons">
          <span>🔒</span>
          <span>🛡️</span>
          <span>✅</span>
        </div>
        <p>Your payment information is encrypted and secure</p>
      </div>
    </div>
  );
};

export default PaymentForm;
