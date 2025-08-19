const { connectToDB } = require("../../config/db");

module.exports = async function getSupportStats(req, res) {
  try {
    const connection = await connectToDB();

    const [[open]]   = await connection.execute(
      `SELECT COUNT(*) AS c FROM support_tickets WHERE status = 'open'`
    );
    const [[closed]] = await connection.execute(
      `SELECT COUNT(*) AS c FROM support_tickets WHERE status = 'closed'`
    );
    const [[totalUsers]] = await connection.execute(
      `SELECT COUNT(*) AS c FROM users`
    );
    const [[totalGuides]] = await connection.execute(
      `SELECT COUNT(*) AS c FROM users WHERE role = 'guide'`
    );

    return res.json({
      open_tickets: open.c,
      resolved_tickets: closed.c,
      total_users: totalUsers.c,
      total_guides: totalGuides.c,
    });
  } catch (err) {
    console.error("getSupportStats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
