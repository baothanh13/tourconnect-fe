const { query } = require("../../config/db");

const deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Xóa booking theo id
    const result = await query(`DELETE FROM bookings WHERE id = ?`, [bookingId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete Booking Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteBooking;
