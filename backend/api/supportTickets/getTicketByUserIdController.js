const { connectToDB } = require("../../config/db");

module.exports = async function getTicketsByUserId(req, res) {
  try {
    const { user_id } = req.params;
    const connection = await connectToDB();

    const [rows] = await connection.execute(
      `SELECT * FROM support_tickets WHERE user_id = ?`,
      [user_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "No tickets found for this user" });
    }

    return res.json(rows); // trả về tất cả tickets
  } catch (err) {
    console.error("getTicketsByUserId error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
