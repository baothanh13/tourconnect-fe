const { connectToDB } = require('../../config/db');

const getGuideById = async (req, res) => {
    const { guideId } = req.params;

    try {
        const connection = await connectToDB();

        const [guides] = await connection.execute(
            `SELECT * FROM guides WHERE id = ?`,
            [guideId]
        );

        if (guides.length === 0) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        const guide = guides[0];

        // Luôn thêm field guide_id cho frontend dùng
        return res.json({
            ...guide,
            guide_id: guide.id,
        });
    } catch (err) {
        console.error('Error fetching guide:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getGuideById;
