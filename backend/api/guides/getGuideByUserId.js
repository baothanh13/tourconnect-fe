const { connectToDB } = require('../../config/db');
const getGuideByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const connection = await connectToDB();

    const [guides] = await connection.execute(
      `SELECT * FROM guides WHERE user_id = ?`,
      [userId]
    );

    if (guides.length === 0) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    return res.json(guides[0]);
  } catch (err) {
    console.error('Error fetching guide by userId:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getGuideByUserId;