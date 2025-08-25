const { connectToDB } = require('../../config/db');

const getBookingByGuideId = async (req, res) => {
  const guideId = req.params.id;

  try {
    const connection = await connectToDB();
    const [results] = await connection.execute(
      `SELECT * FROM bookings WHERE guide_id = ? ORDER BY created_at DESC`,
      [guideId]
    );

    // Nếu không có booking nào, trả về mảng rỗng
    return res.status(200).json({ bookings: results });
  } catch (err) {
    console.error('Get Booking Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getBookingByGuideId;
