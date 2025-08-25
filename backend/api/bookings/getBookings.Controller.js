const { connectToDB } = require('../../config/db');

const getBookings = async (req, res) => {
  const userId = req.query.user_id || req.user.user_id;

  try {
    const connection = await connectToDB();
    const [bookings] = await connection.execute(
      `SELECT * FROM bookings WHERE tourist_id = ? ORDER BY created_at DESC`,
      [userId, userId]
    );
    return res.status(200).json({ bookings });
  } catch (err) {
    console.error('Get Bookings Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getBookings;
