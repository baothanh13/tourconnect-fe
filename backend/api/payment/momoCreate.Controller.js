const { connectToDB } = require('../../config/db');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

/**
 * POST /api/payments/momo/create
 * body: { bookingId, amount, currency, returnUrl?, notifyUrl? }
 */
module.exports = async (req, res) => {
  const {
    bookingId,
    amount,
    currency = 'VND',
    returnUrl,
    notifyUrl
  } = req.body || {};

  if (!bookingId || !amount) {
    return res.status(400).json({ message: 'bookingId and amount are required' });
  }
  if (currency !== 'VND') {
    return res.status(400).json({ message: 'Only VND is supported for MoMo' });
  }

  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey   = process.env.MOMO_ACCESS_KEY;
  const secretKey   = process.env.MOMO_SECRET_KEY;
  const endpoint    = process.env.MOMO_ENDPOINT_CREATE || 'https://test-payment.momo.vn/v2/gateway/api/create';

  try {
    const conn = await connectToDB();

    // Lấy booking để xác định payer (tourist) & payee (guide)
    const [bookings] = await conn.execute(
      `SELECT b.id, b.total_price, b.tourist_id, b.guide_id
       FROM bookings b
       WHERE b.id = ?`,
      [bookingId]
    );
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookings[0];

    // (Optional) Khóa kiểm tra số tiền
    // if (Number(booking.total_price) !== Number(amount)) {
    //   return res.status(400).json({ message: 'Amount mismatch with booking total_price' });
    // }

    const orderId   = `momo_${uuidv4()}`;   // của bạn
    const requestId = uuidv4();             // của bạn
    const orderInfo = `Payment for booking ${bookingId}`;
    const redirectUrl = returnUrl || process.env.BASE_RETURN_URL;
    const ipnUrl      = notifyUrl || process.env.BASE_NOTIFY_URL;
    const requestType = 'captureWallet';
    const extraData   = Buffer.from(JSON.stringify({ bookingId })).toString('base64');

    // Chuỗi ký chữ ký theo tài liệu MoMo
    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

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
      lang: 'vi'
    };

    // Gọi MoMo tạo link thanh toán
    const momoRes = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const momoData = momoRes.data;

    // Lưu bản ghi payments (pending/requires_action)
    const paymentId = uuidv4();
    await conn.execute(
      `INSERT INTO payments
        (id, booking_id, payer_id, payee_guide_id, amount, currency, method, status,
         platform_fee, provider_order_id, provider_payload)
       VALUES (?, ?, ?, ?, ?, ?, 'momo', ?, 0.00, ?, JSON_OBJECT('create', ?))`,
      [
        paymentId, bookingId, booking.tourist_id, booking.guide_id,
        amount, currency,
        momoData?.resultCode === 0 ? 'requires_action' : 'failed',
        orderId,
        JSON.stringify(momoData)
      ]
    );

    // Cập nhật trạng thái booking nếu muốn (vẫn pending cho tới khi callback)
    // await conn.execute(`UPDATE bookings SET payment_status = 'pending' WHERE id = ?`, [bookingId]);

    if (momoData?.resultCode !== 0) {
      return res.status(400).json({
        message: 'MoMo create payment failed',
        momo: momoData
      });
    }

    // Trả về payUrl / deeplink để FE redirect
    return res.json({
      message: 'MoMo payment created',
      paymentId,
      orderId,
      payUrl: momoData.payUrl,
      deeplink: momoData.deeplink,
      qrCodeUrl: momoData.qrCodeUrl
    });
  } catch (err) {
    console.error('MoMo Create Error:', err?.response?.data || err);
    return res.status(500).json({ message: 'Server error', error: err?.message });
  }
};
