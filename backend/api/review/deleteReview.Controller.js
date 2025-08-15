const { connectToDB } = require('../../config/db');

// DELETE /api/reviews/:id
module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await connectToDB();

    // TODO: Nếu có middleware auth, xác thực quyền: chỉ tác giả hoặc admin mới được xóa.

    const [result] = await conn.execute(
      `DELETE FROM reviews WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }

    return res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('deleteReview error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
