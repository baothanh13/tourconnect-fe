const { query } = require('../../config/db');

const removeFavGuide = async (req, res) => {
    const { guideId } = req.body;
    const touristId = req.user.user_id; // Lấy user_id từ token đã decode

    try {
        const result = await query(
            `DELETE FROM favourite_guides WHERE tourist_id = ? AND guide_id = ?`,
            [touristId, guideId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Guide not found in favourites' });
        }

        return res.status(200).json({ message: 'Guide removed from favourites' });
    } catch (err) {
        console.error('Remove Favourite Guide Error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = removeFavGuide;
