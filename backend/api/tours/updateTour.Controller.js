const { pool } = require("../../config/db");

// PUT /api/tours/:id
module.exports = async (req, res) => {
  const { id } = req.params;
  const {
    guide_id,
    title,
    description,
    duration_hours,
    max_people,
    price,
    image_url,
    category,
    tour_date, // thêm
    tour_time, // thêm
  } = req.body || {};

  // Build dynamic SET
  const fields = [];
  const params = [];

  if (guide_id !== undefined) {
    fields.push("guide_id = ?");
    params.push(guide_id);
  }
  if (title !== undefined) {
    fields.push("title = ?");
    params.push(title);
  }
  if (description !== undefined) {
    fields.push("description = ?");
    params.push(description);
  }
  if (duration_hours !== undefined) {
    fields.push("duration_hours = ?");
    params.push(duration_hours);
  }
  if (max_people !== undefined) {
    fields.push("max_people = ?");
    params.push(max_people);
  }
  if (price !== undefined) {
    fields.push("price = ?");
    params.push(price);
  }
  if (image_url !== undefined) {
    fields.push("image_url = ?");
    params.push(image_url);
  }
  if (category !== undefined) {
    fields.push("category = ?");
    params.push(category);
  }
  if (tour_date !== undefined) {
    // thêm
    fields.push("tour_date = ?");
    params.push(tour_date);
  }
  if (tour_time !== undefined) {
    // thêm
    fields.push("tour_time = ?");
    params.push(tour_time);
  }
  if (fields.length === 0) {
    return res.status(400).json({ message: "No updatable fields provided" });
  }

  try {
    const conn = await pool.getConnection();

    // Existence check
    const [exist] = await conn.execute(`SELECT id FROM tours WHERE id = ?`, [
      id,
    ]);
    if (exist.length === 0)
      return res.status(404).json({ message: "Tour not found" });

    // Validate guide if changed
    if (guide_id !== undefined) {
      const [g] = await conn.execute(`SELECT id FROM guides WHERE id = ?`, [
        guide_id,
      ]);
      if (g.length === 0)
        return res.status(400).json({ message: "Guide does not exist" });
    }

    const sql = `UPDATE tours SET ${fields.join(
      ", "
    )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    params.push(id);

    await conn.execute(sql, params);

    return res.json({ message: "Tour updated" });
  } catch (err) {
    console.error("updateTour error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
