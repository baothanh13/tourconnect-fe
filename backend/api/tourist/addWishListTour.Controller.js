const { connectToDB } = require('../../config/db');

const addToWishlist = async (req, res) => {
  const { tourId } = req.body;
  const touristId = req.user.user_id; // lấy từ token
  try {
    const connection = await connectToDB();

    // insert (bị trùng sẽ báo lỗi)
    await connection.execute(
      `INSERT INTO wishlists (tourist_id, tour_id) VALUES (?, ?)`,
      [touristId, tourId]
    );

    return res.status(201).json({ message: "Tour added to wishlist" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Tour already in wishlist" });
    }
    console.error("Add to wishlist error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = addToWishlist;