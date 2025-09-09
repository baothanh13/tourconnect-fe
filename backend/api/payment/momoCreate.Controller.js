const { connectToDB } = require("../../config/db");
const axios = require("axios");
const crypto = require("crypto");
const generateId = require("../../utils/generateId");

/**
 * POST /api/payments/momo/create
 * body: { bookingId, amount }
 */
module.exports = async (req, res) => {
  const { bookingId, amount, currency = "VND" } = req.body || {};

  if (!bookingId || !amount) {
    return res
      .status(400)
      .json({ message: "bookingId and amount are required" });
  }
  if (currency !== "VND") {
    return res.status(400).json({ message: "Only VND is supported for MoMo" });
  }

  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const endpoint =
    process.env.MOMO_ENDPOINT_CREATE ||
    "https://test-payment.momo.vn/v2/gateway/api/create";

  try {
    const conn = await connectToDB();

    // 🔍 Lấy booking
    const [bookings] = await conn.execute(
      `SELECT id, total_price, tourist_id, guide_id FROM bookings WHERE id = ?`,
      [bookingId]
    );
    if (bookings.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const booking = bookings[0];

    // Tạo orderId, requestId (orderId phải unique cho mỗi lần thanh toán)
    const orderId = generateId("order"); // Tạo orderId unique thay vì dùng bookingId
    const requestId = generateId("payment");
    const orderInfo = `Payment for booking ${bookingId}`;

    // 🚩 Domain local
    const redirectUrl = "http://localhost:3000/payment/success";
    const ipnUrl = "http://localhost:5000/api/payments/momo/callback";

    const requestType = "captureWallet";
    const extraData = Buffer.from(JSON.stringify({ bookingId })).toString(
      "base64"
    );

    // 🔑 Ký chữ ký
    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      amount: String(amount),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    console.log("📤 Sending MoMo create payment request:", payload);

    // 🚀 Gọi MoMo
    const momoRes = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    const momoData = momoRes.data;
    console.log("📥 MoMo response:", momoData);

    if (momoData?.resultCode !== 0) {
      return res.status(400).json({
        message: "MoMo create payment failed",
        momo: momoData,
      });
    }

    // 💾 Insert payment record vào database
    const paymentId = generateId("payment");
    await conn.execute(
      `INSERT INTO payments (id, booking_id, payer_id, payee_guide_id, amount, currency, method, status, provider_order_id)
       VALUES (?, ?, ?, ?, ?, ?, 'momo', 'pending', ?)`,
      [
        paymentId,
        bookingId,
        booking.tourist_id,
        booking.guide_id,
        amount,
        currency,
        orderId,
      ]
    );

    // 💾 Cập nhật trạng thái booking → pending payment
    await conn.execute(
      `UPDATE bookings
       SET payment_status = 'pending'
       WHERE id = ?`,
      [bookingId]
    );

    return res.json({
      message: "MoMo payment created",
      id: paymentId,
      bookingId,
      orderId,
      payUrl: momoData.payUrl,
      deeplink: momoData.deeplink,
      qrCodeUrl: momoData.qrCodeUrl,
    });
  } catch (err) {
    console.error("❌ MoMo Create Error:", err?.response?.data || err);
    return res
      .status(500)
      .json({ message: "Server error", error: err?.message });
  }
};
