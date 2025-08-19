const { connectToDB } = require("../../config/db");

module.exports = async function deleteTicket(req, res) {
  try {
    const { id } = req.params;
    const connection = await connectToDB();

    const [exists] = await connection.execute(
      `SELECT id FROM support_tickets WHERE id = ?`,
      [id]
    );
    if (!exists.length) return res.status(404).json({ message: "Ticket not found" });

    await connection.execute(
      `DELETE FROM support_tickets WHERE id = ?`,
      [id]
    );

    return res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error("deleteTicket error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
