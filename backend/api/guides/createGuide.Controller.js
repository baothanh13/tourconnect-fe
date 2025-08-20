const { connectToDB } = require('../../config/db');
const generateId = require('../../utils/generateId');

const createGuide = async (req, res) => {
  const {
    location,
    languages = [],
    specialties = [],
    price_per_hour,
    experience_years,
    description,
    certificates = []
  } = req.body;

  try {
    const connection = await connectToDB();

    // ✅ lấy user_id từ token decode bởi verifyToken
    const userId = req.user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    // ✅ sinh guide_id mới
    const guideId = generateId('guide');

    // ✅ chèn dữ liệu, dùng đúng biến userId (trước đây bạn dùng nhầm user_id)
    await connection.execute(
      `INSERT INTO guides
        (id, user_id, location, languages, specialties, price_per_hour, experience_years, description, certificates)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guideId,
        userId,
        location || null,
        JSON.stringify(languages),
        JSON.stringify(specialties),
        price_per_hour ?? null,
        experience_years ?? null,
        description || null,
        JSON.stringify(certificates)
      ]
    );

    return res.status(201).json({
      message: 'Guide profile created successfully',
      guide_id: guideId,
      user_id: userId
    });
  } catch (err) {
    console.error('Error creating guide profile:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createGuide;
