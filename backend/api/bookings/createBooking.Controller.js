const { pool } = require('../../config/db');
const generateId = require('../../utils/generateId');

const createBooking = async (req, res) => {
  const {
    guideId,
    date,
    timeSlot,
    duration,
    numberOfTourists,
    specialRequests,
    totalPrice,
  } = req.body;

  const bookingId = generateId('booking');

  try {
    // Lấy tourist_id từ token (middleware auth đã gắn vào req.user)
    const touristId = req.user.user_id;  // Lấy user_id từ token đã decode
    
    console.log('Creating booking with data:', {
      bookingId,
      guideId,
      touristId,
      date,
      timeSlot,
      duration,
      numberOfTourists,
      specialRequests,
      totalPrice
    });

    await pool.execute(
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
    
    console.log('Booking created successfully:', bookingId);
    return res.status(201).json({ message: 'Booking created', bookingId });
  } catch (err) {
    console.error('Create Booking Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = createBooking;