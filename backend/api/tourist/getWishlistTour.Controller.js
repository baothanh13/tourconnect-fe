const { connectToDB } = require('../../config/db');

const getWishlist = async (req, res) => {
  const touristId = req.user.user_id;
  try {
    const connection = await connectToDB();

    const [rows] = await connection.execute(
      `SELECT w.id, w.tour_id, t.name AS tour_name, w.created_at
       FROM wishlists w
       JOIN tours t ON w.tour_id = t.id
       WHERE w.tourist_id = ?`,
      [touristId]
    );

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Get wishlist error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = getWishlist;