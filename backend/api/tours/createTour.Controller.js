const { pool } = require("../../config/db");
const generateId = require("../../utils/generateId");

// POST /api/tours
// body: { guide_id, title, description?, duration_hours?, max_people?, price, image_url?, category? }
module.exports = async (req, res) => {
  const {
    guide_id,
    title,
    description = null,
    duration_hours = null,
    max_people = null,
    price,
    image_url = null,
    category = null,
    tour_date = null,
    tour_time = null,
  } = req.body || {};

  if (!guide_id || !title || price === undefined) {
    return res
      .status(400)
      .json({ message: "guide_id, title and price are required" });
  }

  try {
    // Validate guide exists
    const [g] = await pool.execute(`SELECT id FROM guides WHERE id = ?`, [
      guide_id,
    ]);
    if (g.length === 0)
      return res.status(400).json({ message: "Guide does not exist" });

    const id = generateId("tour");

    await pool.execute(
      `INSERT INTO tours
       (id, guide_id, title, description, duration_hours, max_people, price, image_url, category, tour_date, tour_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        guide_id,
        title,
        description,
        duration_hours,
        max_people,
        price,
        image_url,
        category,
        tour_date,
        tour_time
      ]
    );

    return res.status(201).json({ message: "Tour created", id });
  } catch (err) {
    console.error("createTour error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
