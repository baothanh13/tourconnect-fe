const { connectToDB } = require('../../config/db');
const removeFromWishlist = async (req, res) => {
  const { tourId } = req.params;
  const touristId = req.user.user_id;
  try {
    const connection = await connectToDB();

    const [result] = await connection.execute(
      `DELETE FROM wishlists WHERE tourist_id = ? AND tour_id = ?`,
      [touristId, tourId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tour not found in wishlist" });
    }

    return res.status(200).json({ message: "Tour removed from wishlist" });
  } catch (err) {
    console.error("Remove wishlist error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = removeFromWishlist;