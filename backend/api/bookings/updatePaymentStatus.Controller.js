const { query } = require("../../config/db");

const updatePaymentStatus = async (req, res) => {
  const bookingId = req.params.id;
  const { payment_status } = req.body;

  try {
    await query(`UPDATE bookings SET payment_status = ? WHERE id = ?`, [
      payment_status,
      bookingId,
    ]);
    return res.json({ message: "Payment status update successfuly" });
  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updatePaymentStatus;
