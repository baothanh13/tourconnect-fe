const { connectToDB } = require('../../config/db');

const getBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const connection = await connectToDB();
    const [results] = await connection.execute(
      `SELECT * FROM bookings WHERE id = ?`,
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