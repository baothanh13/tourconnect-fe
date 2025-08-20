const { connectToDB } = require('../../config/db');

const getGuideById = async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await connectToDB();

        const [guides] = await connection.execute(
            `SELECT g.*, u.name, u.avatar_url FROM guides g WHERE g.id = ?`,
            [id]
        );

        if (guides.length === 0) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        return res.json(guides[0]);
    } catch (err) {
        console.error('Error fetching guide:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = getGuideById;