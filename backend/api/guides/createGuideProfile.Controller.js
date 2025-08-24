const { connectToDB } = require("../../config/db");
const generateId = require("../../utils/generateId");

const createGuideProfile = async (req, res) => {
  const {
    location,
    specialties,
    bio,
    pricePerHour = 0,
    experienceYears = 0,
    languages = ["Vietnamese"],
  } = req.body;

  try {
    const connection = await connectToDB();

    // Lấy user_id từ token đã decode
    const userId = req.user.user_id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    // Check if user exists and is a guide
    const [users] = await connection.execute(
      `SELECT * FROM users WHERE id = ? AND role = 'guide'`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Guide user not found" });
    }



    // Generate UUID for guide
    const guideId = generateId("guide");

    // Insert into guides table
    await connection.execute(
      `INSERT INTO guides (
                id, location, languages, specialties, 
                price_per_hour, experience_years, description, 
                rating, total_reviews, is_available, verification_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guideId,
        location,
        JSON.stringify(languages),
        JSON.stringify(specialties),
        pricePerHour,
        experienceYears,
        bio,
        0.0,
        0,
        1,
        "pending",
      ]
    );

    return res.status(201).json({
      message: "Guide profile created successfully",
      guideId: guideId,
    });
  } catch (err) {
    console.error("Create Guide Profile Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = createGuideProfile;
