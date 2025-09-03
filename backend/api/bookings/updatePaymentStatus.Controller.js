const { query } = require("../../config/db");

const updateBookingStatus = async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;

  try {
    await query(`UPDATE bookings SET payment_status = ? WHERE id = ?`, [
      status,
      bookingId,
    ]);
    return res.json({ message: "Booking status updated" });
  } catch (err) {
    console.error("Update Booking Status Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateBookingStatus;
