const generateId = require("../../utils/generateId");
const { connectToDB } = require("../../config/db");

// Chỉ chấp nhận 2 loại support_type
const ALLOWED_TYPES = ["tourist", "guide"];

module.exports = async function createTicket(req, res) {
  try {
    const { subject, message, support_type, email, phone} = req.body;
    const user_id = req.user?.user_id;
    
    // Debug logging
    console.log("Request body:", req.body);
    console.log("Request user:", req.user);
    console.log("Extracted user_id:", user_id); 

    if (!subject || !message || !support_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ALLOWED_TYPES.includes(support_type)) {
      return res
        .status(400)
        .json({ message: "support_type must be 'tourist' or 'guide'" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }

    // optional: check email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const connection = await connectToDB();
    const id = generateId("ticket");

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
    return res.status(500).json({ message: "Server error" });
  }
};
