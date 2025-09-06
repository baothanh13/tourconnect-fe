const { connectToDB } = require('../../config/db');

const getBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const connection = await connectToDB();
    const [results] = await connection.execute(
      `SELECT b.*,
       u.name AS tourist_name,
       u.email AS tourist_email,
       u.phone AS tourist_phone
       FROM bookings b
       JOIN users u ON b.tourist_id = u.id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({ booking: results[0] });
  } catch (err) {
    console.error('Get Booking Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getBookingById;