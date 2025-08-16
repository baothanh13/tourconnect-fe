const { connectToDB } = require('../../config/db');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/payments/:bookingId/refund
 * body: { amount? }  // nếu không truyền -> full amount
 */
module.exports = async (req, res) => {
  const { bookingId } = req.params;
  const { amount } = req.body || {};

  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey   = process.env.MOMO_ACCESS_KEY;
  const secretKey   = process.env.MOMO_SECRET_KEY;
  const endpoint    = process.env.MOMO_ENDPOINT_REFUND || 'https://test-payment.momo.vn/v2/gateway/api/refund';

  try {
    const conn = await connectToDB();

    // Lấy payment gần nhất đã captured
    const [pays] = await conn.execute(
      `SELECT * FROM payments
       WHERE booking_id = ? AND method = 'momo' AND status = 'captured'
       ORDER BY created_at DESC LIMIT 1`,
      [bookingId]
    );
    if (pays.length === 0) {
      return res.status(404).json({ message: 'No captured payment found for this booking' });
    }
    const payment = pays[0];

    const refundAmount = amount ? Number(amount) : Number(payment.amount);
    if (refundAmount <= 0 || refundAmount > Number(payment.amount)) {
      return res.status(400).json({ message: 'Invalid refund amount' });
    }

    // Request MoMo refund
    const requestId = uuidv4();
    const orderId = payment.provider_order_id; // orderId ban đầu
    const transId = payment.provider_transaction_id; // transId từ callback thanh toán

    // raw signature theo tài liệu Refund
    const rawSignature =
      `accessKey=${accessKey}&amount=${refundAmount}` +
      `&orderId=${orderId}` +
      `&partnerCode=${partnerCode}` +
      `&requestId=${requestId}` +
      `&transId=${transId}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      amount: String(refundAmount),
      orderId,
      transId,
      lang: 'vi',
      signature
    };

    const momoRes = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = momoRes.data;

    if (Number(data.resultCode) === 0) {
      // cập nhật payment -> refunded (lưu thêm payload)
      await conn.execute(
        `UPDATE payments
         SET status = 'refunded',
             provider_payload = JSON_SET(COALESCE(provider_payload, JSON_OBJECT()), '$.refund', CAST(? AS JSON)),
             refunded_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [JSON.stringify(data), payment.id]
      );

      // cập nhật booking
      await conn.execute(
        `UPDATE bookings SET payment_status = 'refunded' WHERE id = ?`,
        [bookingId]
      );

      return res.json({ message: 'Refund successful', momo: data });
    }

    return res.status(400).json({ message: 'Refund failed', momo: data });
  } catch (err) {
    console.error('Refund Error:', err?.response?.data || err);
    return res.status(500).json({ message: 'Server error', error: err?.message });
  }
};
