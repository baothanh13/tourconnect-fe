const { connectToDB } = require('../../config/db');

// GET /api/tours/:id
module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await connectToDB();

    const [rows] = await conn.execute(
      `
      SELECT
        t.*
      FROM tours t
      WHERE t.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Tour not found' });

    return res.json(rows[0]);
  } catch (err) {
    console.error('getTourById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
