const { connectToDB } = require("../../config/db");

module.exports = async function updateTicket(req, res) {
  try {
    const { id } = req.params;
    const { subject, message, status, support_type, email, phone } = req.body;

    const set = [];
    const params = [];

    const allowedStatus = ["open", "pending", "closed", "resolved"];
    const allowedTypes = ["user", "guide"];

    if (subject !== undefined) { set.push("subject = ?"); params.push(subject); }
    if (message !== undefined) { set.push("message = ?"); params.push(message); }
    if (status !== undefined) {
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status must be 'open' | 'pending' | 'closed' | 'resolved'" });
      }
      set.push("status = ?");
      params.push(status);
    }
    if (support_type !== undefined) {
      if (!allowedTypes.includes(support_type)) {
        return res.status(400).json({ message: "support_type must be 'user' or 'guide'" });
      }
      set.push("support_type = ?");
      params.push(support_type);
    }
    if (email !== undefined) {
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      set.push("email = ?");
      params.push(email || null);
    }
    if (phone !== undefined) { set.push("phone = ?"); params.push(phone || null); }

    if (!set.length) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const connection = await connectToDB();

    const [exists] = await connection.execute(
      `SELECT id FROM support_tickets WHERE id = ?`,
      [id]
    );
    if (!exists.length) return res.status(404).json({ message: "Ticket not found" });

    await connection.execute(
      `UPDATE support_tickets SET ${set.join(", ")} WHERE id = ?`,
      [...params, id]
    );

    const [rows] = await connection.execute(
      `SELECT * FROM support_tickets WHERE id = ?`,
      [id]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("updateTicket error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
