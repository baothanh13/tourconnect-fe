const { connectToDB } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

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
    category = null
  } = req.body || {};

  if (!guide_id || !title || price === undefined) {
    return res.status(400).json({ message: 'guide_id, title and price are required' });
  }

  try {
    const conn = await connectToDB();

    // Validate guide exists
    const [g] = await conn.execute(`SELECT id FROM guides WHERE id = ?`, [guide_id]);
    if (g.length === 0) return res.status(400).json({ message: 'Guide does not exist' });

    const id = uuidv4();

    await conn.execute(
      `INSERT INTO tours
       (id, guide_id, title, description, duration_hours, max_people, price, image_url, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, guide_id, title, description, duration_hours, max_people, price, image_url, category]
    );

    return res.status(201).json({ message: 'Tour created', id });
  } catch (err) {
    console.error('createTour error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
