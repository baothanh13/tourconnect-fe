const { connectToDB } = require('../../config/db');

// PUT /api/reviews/:id
// body: { rating?: number(1..5), comment?: string }
module.exports = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (rating !== undefined) {
    const r = Number(rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  }

  // Xây SET động theo các trường được gửi
  const fields = [];
  const values = [];

  if (rating !== undefined) {
    fields.push('rating = ?');
    values.push(rating);
  }
  if (comment !== undefined) {
    fields.push('comment = ?');
    values.push(comment);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No updatable fields provided' });
  }

  try {
    const conn = await connectToDB();

    // Kiểm tra tồn tại
    const [existRows] = await conn.execute(
      `SELECT id FROM reviews WHERE id = ?`,
      [id]
    );
    if (existRows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // TODO: Nếu có middleware auth, xác thực quyền: chỉ tác giả (tourist_id) hoặc admin mới được sửa.

    const sql = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await conn.execute(sql, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Nothing updated' });
    }

    return res.json({ message: 'Review updated successfully' });
  } catch (err) {
    console.error('updateReview error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};