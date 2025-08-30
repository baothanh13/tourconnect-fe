const { connectToDB } = require('../../config/db');

const addFavGuide = async (req, res) => {
    const { guideId } = req.body;
    const touristId = req.user.user_id; // Lấy user_id từ token đã decode

    try {
        const connection = await connectToDB();
        // Kiểm tra nếu đã tồn tại trong danh sách yêu thích
        const [existing] = await connection.execute(
            `SELECT * FROM favourite_guides WHERE tourist_id = ? AND guide_id = ?`,
            [touristId, guideId]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Guide already in favourites' });
        }

        await connection.execute(
            `INSERT INTO favourite_guides (tourist_id, guide_id) VALUES (?, ?)`,
            [touristId, guideId]
        );
        return res.status(201).json({ message: 'Guide added to favourites' });
    }
    catch (err) {
        console.error('Add Favourite Guide Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = addFavGuide;