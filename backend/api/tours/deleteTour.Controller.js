const { pool } = require("../../config/db");

// DELETE /api/tours/:id
module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await pool.getConnection();

    // Check exists
    const [exist] = await conn.execute(`SELECT id FROM tours WHERE id = ?`, [
      id,
    ]);
    if (exist.length === 0)
      return res.status(404).json({ message: "Tour not found" });

    // Try delete (FK might block if there are reviews/bookings referencing)
    try {
      const [result] = await conn.execute(`DELETE FROM tours WHERE id = ?`, [
        id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Nothing deleted" });
      }
      return res.json({ message: "Tour deleted" });
    } catch (fkErr) {
      // If FK constraint fails
      return res.status(409).json({
        message:
          "Cannot delete tour due to existing references (bookings/reviews)",
        error: fkErr.message,
      });
    }
  } catch (err) {
    console.error("deleteTour error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
