// src/services/paymentService.js

// Note: Stripe will be initialized when needed
// const stripePromise = loadStripe('pk_live_...');

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const PaymentService = {
  // Create MoMo payment
 createMoMoPayment: async (bookingId, amount, currency = "VND") => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/momo/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create MoMo payment");
      }

      return await response.json(); // { bookingId, orderId, payUrl, ... }
    } catch (error) {
      console.error("❌ MoMo payment creation error:", error);
      throw error;
    }
  },


  // Get payment status
 getPaymentStatus: async (bookingId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/status/${bookingId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to get booking payment status"
        );
      }

      return await response.json(); // { booking: {...} }
    } catch (error) {
      console.error("❌ Booking payment status error:", error);
      throw error;
    }
  },


  // Process booking payment
  processBookingPayment: async (bookingData, paymentMethod) => {
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const paymentResult = {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount: bookingData.totalPrice,
        currency: "USD",
        paymentMethod: paymentMethod.type,
        timestamp: new Date().toISOString(),
        bookingId: bookingData.id,
        receipt: {
          receiptNumber: `RCP-${Date.now()}`,
          customerEmail: bookingData.customerEmail,
          description: `Tour booking: ${bookingData.tourTitle}`,
          items: [
            {
              description: bookingData.tourTitle,
              quantity: bookingData.participants,
              unitPrice: bookingData.pricePerPerson,
              total: bookingData.totalPrice,
            },
          ],
        },
      };

      // Save transaction to localStorage (simulate database)
      const transactions = JSON.parse(
        localStorage.getItem("tourconnect_transactions") || "[]"
      );
      transactions.push(paymentResult);
      localStorage.setItem(
        "tourconnect_transactions",
        JSON.stringify(transactions)
      );

      return paymentResult;
    } catch (error) {
      throw new Error(`Payment failed: ${error.message}`);
    }
  },

  // Process refund
  processRefund: async (transactionId, amount, reason) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const refundResult = {
        success: true,
        refundId: `ref_${Date.now()}`,
        originalTransactionId: transactionId,
        amount: amount,
        reason: reason,
        timestamp: new Date().toISOString(),
        status: "completed",
      };

      // Save refund to localStorage
      const refunds = JSON.parse(
        localStorage.getItem("tourconnect_refunds") || "[]"
      );
      refunds.push(refundResult);
      localStorage.setItem("tourconnect_refunds", JSON.stringify(refunds));

      return refundResult;
    } catch (error) {
      throw new Error(`Refund failed: ${error.message}`);
    }
  },

  // Get payment methods
  getPaymentMethods: () => {
    return [
      {
        id: "card",
        type: "card",
        name: "Credit/Debit Card",
        icon: "💳",
        description: "Visa, Mastercard, American Express",
      },
      {
        id: "momo",
        type: "momo",
        name: "MoMo Wallet",
        icon: "📱",
        description: "Pay with MoMo e-wallet",
      },
      {
        id: "paypal",
        type: "paypal",
        name: "PayPal",
        icon: "🟦",
        description: "Pay with your PayPal account",
      },
      {
        id: "bank_transfer",
        type: "bank_transfer",
        name: "Bank Transfer",
        icon: "🏦",
        description: "Direct bank transfer",
      },
      {
        id: "apple_pay",
        type: "apple_pay",
        name: "Apple Pay",
        icon: "🍎",
        description: "Pay with Touch ID or Face ID",
      },
      {
        id: "google_pay",
        type: "google_pay",
        name: "Google Pay",
        icon: "🔍",
        description: "Pay with your Google account",
      },
    ];
  },

  // Process MoMo payment
  processMoMoPayment: async (momoData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const momoResult = {
        success: true,
        paymentId: `momo_${Date.now()}`,
        transactionId: `momo_txn_${Date.now()}`,
        phoneNumber: momoData.phoneNumber,
        amount: momoData.amount,
        redirectUrl: `momo://payment?amount=${momoData.amount}&phone=${momoData.phoneNumber}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=momo_payment_${Date.now()}`,
        status: "pending_confirmation",
        timestamp: new Date().toISOString(),
      };

      // Save MoMo transaction to localStorage
      const transactions = JSON.parse(
        localStorage.getItem("tourconnect_transactions") || "[]"
      );
      transactions.push(momoResult);
      localStorage.setItem(
        "tourconnect_transactions",
        JSON.stringify(transactions)
      );

      return momoResult;
    } catch (error) {
      throw new Error(`MoMo payment failed: ${error.message}`);
    }
  },

  // Calculate service fees
  calculateFees: (amount, method = "card") => {
    const fees = {
      card: 0.029, // 2.9%
      momo: 0.015, // 1.5%
      paypal: 0.034, // 3.4%
      bank_transfer: 0.01, // 1%
      apple_pay: 0.029, // 2.9%
      google_pay: 0.029, // 2.9%
    };

    const feeRate = fees[method] || 0.029;
    const serviceFee = amount * feeRate;
    const total = amount + serviceFee;

    return {
      subtotal: amount,
      serviceFee: Math.round(serviceFee * 100) / 100,
      total: Math.round(total * 100) / 100,
      feeRate: feeRate * 100,
    };
  },

  // Validate card number using Luhn algorithm
  validateCardNumber: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    let sum = 0;
    let alternate = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let n = parseInt(cleanNumber.charAt(i), 10);

      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }

      sum += n;
      alternate = !alternate;
    }

    return (
      sum % 10 === 0 && cleanNumber.length >= 13 && cleanNumber.length <= 19
    );
  },

  // Get card type
  getCardType: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "American Express";
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover";

    return "Card";
  },

  // Format card number for display
  formatCardNumber: (cardNumber) => {
    return cardNumber
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  },

  // Process general payment (enhanced for multi-method support)
  processPayment: async (paymentData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate payment processing with higher success rate
      const success = Math.random() > 0.1; // 90% success rate

      if (!success) {
        throw new Error(
          "Payment declined by your bank. Please try a different card."
        );
      }

      const paymentResult = {
        success: true,
        paymentId: `pay_${Date.now()}`,
        transactionId: `txn_${Date.now()}`,
        amount: paymentData.amount,
        method: paymentData.method,
        status: "completed",
        processedAt: new Date().toISOString(),
        billingAddress: paymentData.billingAddress,
      };

      // Save transaction to localStorage
      const transactions = JSON.parse(
        localStorage.getItem("tourconnect_transactions") || "[]"
      );
      transactions.push(paymentResult);
      localStorage.setItem(
        "tourconnect_transactions",
        JSON.stringify(transactions)
      );

      return paymentResult;
    } catch (error) {
      throw new Error(error.message || "Payment processing failed");
    }
  },
  validatePaymentData: (paymentData) => {
    const errors = {};

    if (paymentData.method === "card") {
      if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
        errors.cardNumber = "Valid card number is required";
      } else if (!PaymentService.validateCardNumber(paymentData.cardNumber)) {
        errors.cardNumber = "Invalid card number";
      }

      if (
        !paymentData.expiryDate ||
        !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)
      ) {
        errors.expiryDate = "Valid expiry date is required (MM/YY)";
      }

      if (!paymentData.cvv || paymentData.cvv.length < 3) {
        errors.cvv = "Valid CVV is required";
      }

      if (
        !paymentData.cardholderName ||
        paymentData.cardholderName.trim().length < 2
      ) {
        errors.cardholderName = "Cardholder name is required";
      }
    }

    if (paymentData.method === "momo") {
      if (
        !paymentData.phoneNumber ||
        !/^\d{10,11}$/.test(paymentData.phoneNumber)
      ) {
        errors.phoneNumber = "Valid phone number is required";
      }
    }

    if (paymentData.method === "bank_transfer") {
      if (!paymentData.bankAccount || paymentData.bankAccount.length < 8) {
        errors.bankAccount = "Valid bank account is required";
      }
    }

    // Validate billing address if provided
    if (paymentData.billingAddress) {
      const billing = paymentData.billingAddress;
      if (!billing.firstName || billing.firstName.trim().length < 1) {
        errors.firstName = "First name is required";
      }
      if (!billing.lastName || billing.lastName.trim().length < 1) {
        errors.lastName = "Last name is required";
      }
      if (!billing.email || !/\S+@\S+\.\S+/.test(billing.email)) {
        errors.email = "Valid email is required";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  // Get transaction history
  getTransactionHistory: (userId) => {
    const transactions = JSON.parse(
      localStorage.getItem("tourconnect_transactions") || "[]"
    );
    return transactions.filter((t) => t.bookingId && t.receipt.customerEmail);
  },

  // Currency conversion (mock)
  convertCurrency: async (amount, fromCurrency, toCurrency) => {
    const exchangeRates = {
      USD: { VND: 24000, EUR: 0.85, GBP: 0.73 },
      VND: { USD: 0.000042, EUR: 0.000035, GBP: 0.00003 },
      EUR: { USD: 1.18, VND: 28500, GBP: 0.86 },
      GBP: { USD: 1.37, VND: 33000, EUR: 1.16 },
    };

    if (fromCurrency === toCurrency) return amount;

    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
    return Math.round(amount * rate * 100) / 100;
  },
};

export default PaymentService;
