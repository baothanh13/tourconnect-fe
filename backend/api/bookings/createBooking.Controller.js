const { connectToDB } = require("../../config/db");
const generateId = require("../../utils/generateId");

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

  const bookingId = generateId("booking");

  try {
    const connection = await connectToDB();

    // Lấy tourist_id từ token (middleware auth đã gắn vào req.user)
    const touristId = req.user.user_id;

    const sql = `
      INSERT INTO bookings 
      (id, guide_id, tourist_id, booking_date, time_slot, duration_hours, number_of_tourists, special_requests, total_price) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      bookingId,
      guideId,
      touristId,
      date,
      timeSlot, // Using the original timeSlot variable
      duration,
      numberOfTourists,
      specialRequests,
      totalPrice,
    ];

    await connection.execute(sql, values);

    return res.status(201).json({ message: "Booking created", bookingId });
  } catch (err) {
    console.error("Create Booking Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createBooking;
