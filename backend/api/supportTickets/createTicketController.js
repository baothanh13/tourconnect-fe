const { v4: uuidv4 } = require("uuid");
const { connectToDB } = require("../../config/db");

const ALLOWED_TYPES = ["user", "guide"];

module.exports = async function createTicket(req, res) {
  try {
    const { user_id, subject, message, support_type, email, phone } = req.body;

    if (!user_id || !subject || !message || !support_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!ALLOWED_TYPES.includes(support_type)) {
      return res.status(400).json({ message: "support_type must be 'user' or 'guide'" });
    }
    // optional: simple email check
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const connection = await connectToDB();
    const id = uuidv4();

    await connection.execute(
      `INSERT INTO support_tickets
        (id, user_id, subject, message, status, support_type, email, phone)
       VALUES (?, ?, ?, ?, 'open', ?, ?, ?)`,
      [id, user_id, subject, message, support_type, email || null, phone || null]
    );

    const [rows] = await connection.execute(
      `SELECT * FROM support_tickets WHERE id = ?`,
      [id]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("createTicket error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
