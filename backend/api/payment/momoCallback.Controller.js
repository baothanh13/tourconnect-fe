const { connectToDB } = require('../../config/db');
const crypto = require('crypto');

/**
 * POST /api/payments/momo/callback
 * MoMo IPN (webhook) sẽ gọi tới endpoint này
 * Xác minh chữ ký -> cập nhật payments + bookings
 */
module.exports = async (req, res) => {
  try {
    const secretKey = process.env.MOMO_SECRET_KEY;

    // Payload theo tài liệu MoMo
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
      signature
    } = req.body || {};

    // Build raw signature để verify
    const rawSignature =
      `accessKey=${process.env.MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData || ''}` +
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
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (calcSignature !== signature) {
      // Sai chữ ký -> từ chối
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Giải bookingId từ extraData (có thể sử dụng trong tương lai)
    // let bookingIdFromExtra = null;
    // try {
    //   const decoded = JSON.parse(Buffer.from(extraData || '', 'base64').toString('utf8'));
    //   bookingIdFromExtra = decoded?.bookingId || null;
    // } catch {}

    const conn = await connectToDB();

    // Tìm payment theo provider_order_id (orderId)
    const [pays] = await conn.execute(
      `SELECT id, booking_id FROM payments WHERE provider_order_id = ? LIMIT 1`,
      [orderId]
    );

    if (pays.length === 0) {
      // Không tìm thấy payment tương ứng -> vẫn trả 204 để MoMo không spam
      return res.status(204).send();
    }
    const payment = pays[0];

    // Update trạng thái theo resultCode
    if (Number(resultCode) === 0) {
      await conn.execute(
        `UPDATE payments
         SET status = 'captured',
             provider_transaction_id = ?,
             provider_payload = JSON_SET(COALESCE(provider_payload, JSON_OBJECT()), '$.callback', CAST(? AS JSON)),
             paid_at = CURRENT_TIMESTAMP
         WHERE provider_order_id = ?`,
        [String(transId), JSON.stringify(req.body), orderId]
      );

      // Cập nhật booking
      await conn.execute(
        `UPDATE bookings SET payment_status = 'paid', status = 'confirmed' WHERE id = ?`,
        [payment.booking_id]
      );
    } else {
      await conn.execute(
        `UPDATE payments
         SET status = 'failed',
             provider_transaction_id = ?,
             provider_payload = JSON_SET(COALESCE(provider_payload, JSON_OBJECT()), '$.callback', CAST(? AS JSON))
         WHERE provider_order_id = ?`,
        [String(transId || ''), JSON.stringify(req.body), orderId]
      );

      await conn.execute(
        `UPDATE bookings SET payment_status = 'pending' WHERE id = ?`,
        [payment.booking_id]
      );
    }

    // Trả OK cho MoMo
    return res.status(204).send(); // hoặc res.json({ result: 0 })
  } catch (err) {
    console.error('MoMo Callback Error:', err);
    // Luôn trả 204 để tránh retry quá nhiều (tùy chính sách)
    return res.status(204).send();
  }
};
