const { connectToDB } = require("../../config/db");

module.exports = async function getTicketById(req, res) {
  try {
    const { id } = req.params;
    const connection = await connectToDB();

    const [rows] = await connection.execute(
      `SELECT * FROM support_tickets WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
