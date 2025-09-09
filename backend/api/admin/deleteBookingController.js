const { connectToDB } = require("../../config/db");

/**
 * DELETE /api/admin/bookings/:id
 * Delete a booking by ID
 */
module.exports = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Booking ID is required" });
  }

  try {
    const conn = await connectToDB();

    // First check if the booking exists
    const [bookings] = await conn.execute(
      "SELECT id, status FROM bookings WHERE id = ?",
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = bookings[0];

    // Prevent deletion of paid bookings (optional business rule)
    if (booking.payment_status === "paid") {
      return res.status(400).json({
        message:
          "Cannot delete a booking that has been paid. Please refund first.",
      });
    }

    // Delete related records first (if any foreign key constraints exist)
    // Delete from payments table if exists
    await conn.execute("DELETE FROM payments WHERE booking_id = ?", [id]);

    // Delete from reviews table if exists
    await conn.execute("DELETE FROM reviews WHERE booking_id = ?", [id]);

    // Finally delete the booking
    const [deleteResult] = await conn.execute(
      "DELETE FROM bookings WHERE id = ?",
      [id]
    );

    if (deleteResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Booking not found or already deleted" });
    }

    res.json({
      message: "Booking deleted successfully",
      deletedBookingId: id,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};
