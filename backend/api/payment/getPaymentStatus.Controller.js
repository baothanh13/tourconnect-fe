const { connectToDB } = require('../../config/db');

module.exports = async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ message: 'Missing bookingId' });
  }

  try {
    const conn = await connectToDB();

    const [rows] = await conn.execute(
      `SELECT
         b.id,
         b.tourist_id,
         b.guide_id,
         b.total_price AS amount,
         b.payment_status,
         b.status,
         b.booking_date,
         b.created_at
       FROM bookings b
       WHERE b.id = ?
       LIMIT 1`,
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No booking found for this bookingId' });
    }

    return res.json({ booking: rows[0] });
  } catch (err) {
    console.error('Get Booking Payment Status Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
