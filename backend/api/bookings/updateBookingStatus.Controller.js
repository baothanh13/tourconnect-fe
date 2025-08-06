const { connectToDB } = require('../../config/db');

const updateBookingStatus = async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    const connection = await connectToDB();
    await connection.execute(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      [status, bookingId]
    );
    return res.json({ message: 'Booking status updated' });
  } catch (err) {
    console.error('Update Booking Status Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateBookingStatus;