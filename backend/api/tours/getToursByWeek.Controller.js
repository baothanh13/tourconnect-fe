const { pool } = require("../../config/db");

module.exports = async (req, res) => {
  try {
    const { date, guide_id } = req.query;

    if (!date || !guide_id) {
      return res
        .status(400)
        .json({ message: "Thiếu tham số date hoặc guide_id" });
    }

    // Hàm parse date an toàn, không bị lệch timezone
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day); // month - 1 vì JS tính từ 0
    };

    const inputDate = parseDate(date);
    if (isNaN(inputDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Ngày không hợp lệ (YYYY-MM-DD)" });
    }

    // Tính thứ Hai và Chủ Nhật trong tuần
    const dayOfWeek = inputDate.getDay(); // 0=CN, 1=T2, ...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format yyyy-mm-dd
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const startDate = formatDate(monday);
    const endDate = formatDate(sunday);

    const conn = await pool.getConnection();

    const sql = `
      SELECT
        id,
        title,
        description,
        category,
        tour_date,
        tour_time
      FROM tours
      WHERE guide_id = ?
        AND tour_date BETWEEN ? AND ?
      ORDER BY tour_date ASC
    `;

    const [rows] = await conn.execute(sql, [guide_id, startDate, endDate]);

    conn.release();

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có tour nào trong tuần này" });
    }

    // ✅ Format lại tour_date và tour_time
    const formattedRows = rows.map((tour) => {
      const d = new Date(tour.tour_date);
      const formattedDate = `${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;

      const time = tour.tour_time ? tour.tour_time.slice(0, 5) : null; // HH:mm:ss -> HH:mm

      return {
        ...tour,
        tour_date: formattedDate,
        tour_time: time,
      };
    });

    return res.json({
      week: { start: startDate, end: endDate },
      guide_id,
      tours: formattedRows,
    });
  } catch (err) {
    console.error("getToursByWeek error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
