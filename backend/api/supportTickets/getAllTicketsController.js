const { connectToDB } = require("../../config/db");

module.exports = async function getAllTickets(req, res) {
  try {
    const { status, support_type, q, page = 1, limit = 20, sort = "created_at", order = "desc" } = req.query;

    const allowedStatus = ["open", "pending", "closed"];
    const allowedTypes = ["user", "guide"];
    const allowedSort = ["created_at", "updated_at", "status"];

    const where = [];
    const params = [];

    if (status && allowedStatus.includes(status)) {
      where.push(`status = ?`);
      params.push(status);
    }
    if (support_type && allowedTypes.includes(support_type)) {
      where.push(`support_type = ?`);
      params.push(support_type);
    }
    if (q && q.trim()) {
      where.push(`(subject LIKE ? OR message LIKE ? OR email LIKE ? OR phone LIKE ?)`);
      const like = `%${q.trim()}%`;
      params.push(like, like, like, like);
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sortCol = allowedSort.includes(sort) ? sort : "created_at";
    const sortOrder = String(order).toLowerCase() === "asc" ? "ASC" : "DESC";

    const offset = (Number(page) - 1) * Number(limit);

    const connection = await connectToDB();

    // total count
    const [countRows] = await connection.execute(
      `SELECT COUNT(*) AS total FROM support_tickets ${whereSQL}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // page data
    const [rows] = await connection.execute(
      `SELECT *
      FROM support_tickets 
      ${whereSQL}
      ORDER BY ${sortCol} ${sortOrder}
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      params
    );

    return res.json({
      data: rows,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
    });
  } catch (err) {
    console.error("getAllTickets error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
