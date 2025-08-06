const { connectToDB } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

const createBooking = async (req, res) => {
  const {
    guideId,
    touristId,
    date,
    timeSlot,
    duration,
    numberOfTourists,
    specialRequests,
    totalPrice,
  } = req.body;

  const bookingId = uuidv4();

  try {
    const connection = await connectToDB();
    await connection.execute(
      `INSERT INTO bookings (id, guide_id, tourist_id, booking_date, time_slot, duration_hours, number_of_tourists, special_requests, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        guideId,
        touristId,
        date,
        timeSlot,
        duration,
        numberOfTourists,
        specialRequests,
        totalPrice,
      ]
    );
    return res.status(201).json({ message: 'Booking created', bookingId });
  } catch (err) {
    console.error('Create Booking Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createBooking;