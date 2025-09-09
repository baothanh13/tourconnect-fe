const { connectToDB } = require("../../config/db");
const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    const secretKey = process.env.MOMO_SECRET_KEY;
    const isProd = process.env.NODE_ENV === "production";

    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body || {};

    // 🔑 Tạo lại chữ ký để kiểm tra
    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData || ""}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const calcSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    if (isProd && calcSignature !== signature) {
      console.warn("⚠️ Invalid MoMo signature", { orderId });
      return res.status(400).json({ message: "Invalid signature" });
    } else if (!isProd) {
      console.log("⚠️ Sandbox mode: skip signature validation", { orderId });
    }

    console.log("📥 MoMo Callback:", req.body);

    const conn = await connectToDB();

    // Decode extraData → bookingId
    let bookingId;
    try {
      const extra = JSON.parse(Buffer.from(extraData, "base64").toString());
      bookingId = extra.bookingId;
    } catch (e) {
      console.warn("⚠️ Cannot decode extraData", extraData);
    }

    if (!bookingId) {
      console.warn("⚠️ Callback without bookingId");
      return res.json({ resultCode: 0, message: "OK" });
    }

    if (Number(resultCode) === 0) {
      console.log("✅ MoMo payment success:", { orderId, bookingId });

      // Update payments table
      await conn.execute(
        `UPDATE payments 
         SET status = 'captured', 
             provider_transaction_id = ?,
             paid_at = NOW(),
             provider_payload = ?
         WHERE provider_order_id = ?`,
        [transId, JSON.stringify(req.body), orderId]
      );

      // Update bookings table
      await conn.execute(
        `UPDATE bookings
         SET payment_status = 'paid',
             status = 'confirmed'
         WHERE id = ?`,
        [bookingId]
      );
    } else {
      console.warn("❌ MoMo payment failed", { orderId, resultCode, message });

      // Update payments table
      await conn.execute(
        `UPDATE payments 
         SET status = 'failed',
             provider_payload = ?
         WHERE provider_order_id = ?`,
        [JSON.stringify(req.body), orderId]
      );

      // Update bookings table
      await conn.execute(
        `UPDATE bookings
         SET payment_status = 'failed',
             status = 'cancelled'
         WHERE id = ?`,
        [bookingId]
      );
    }

    // Luôn trả OK cho MoMo
    return res.json({ resultCode: 0, message: "OK" });
  } catch (err) {
    console.error("❌ MoMo Callback Error:", err);
    return res.json({ resultCode: 0, message: "OK" });
  }
};
