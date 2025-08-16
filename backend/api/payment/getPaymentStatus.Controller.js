const { connectToDB } = require('../../config/db');

/**
 * GET /api/payments/:bookingId
 * Lấy trạng thái thanh toán mới nhất của booking
 */
module.exports = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const conn = await connectToDB();

    const [rows] = await conn.execute(
      `SELECT
         p.id,
         p.booking_id,
         p.amount,
         p.currency,
         p.method,
         p.status,
         p.platform_fee,
         p.net_amount,
         p.provider_transaction_id,
         p.provider_order_id,
         p.paid_at,
         p.refunded_at,
         p.created_at,
         p.updated_at
       FROM payments p
       WHERE p.booking_id = ?
       ORDER BY p.created_at DESC
       LIMIT 1`,
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No payment found for this booking' });
    }

    return res.json({ payment: rows[0] });
  } catch (err) {
    console.error('Get Payment Status Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
