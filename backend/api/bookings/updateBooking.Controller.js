const { connectToDB } = require('../../config/db');

const updateBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { timeSlot, duration, numberOfTourists, specialRequests } = req.body;

  try {
    const connection = await connectToDB();
    await connection.execute(
      `UPDATE bookings SET time_slot = ?, duration_hours = ?, number_of_tourists = ?, special_requests = ? WHERE id = ?`,
      [timeSlot, duration, numberOfTourists, specialRequests, bookingId]
    );
    return res.json({ message: 'Booking updated' });
  } catch (err) {
    console.error('Update Booking Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateBooking;
