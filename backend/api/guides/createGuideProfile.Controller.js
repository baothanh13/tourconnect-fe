const { connectToDB } = require("../../config/db");
const { v4: uuidv4 } = require("uuid");

const createGuideProfile = async (req, res) => {
  const {
    userId,
    location,
    specialties,
    bio,
    pricePerHour = 0,
    experienceYears = 0,
    languages = ["Vietnamese"],
  } = req.body;

  try {
    const connection = await connectToDB();

    // Check if user exists and is a guide
    const [users] = await connection.execute(
      `SELECT * FROM users WHERE id = ? AND role = 'guide'`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Guide user not found" });
    }

    // Check if guide profile already exists
    const [existingGuides] = await connection.execute(
      `SELECT * FROM guides WHERE user_id = ?`,
      [userId]
    );

    if (existingGuides.length > 0) {
      return res.status(400).json({ message: "Guide profile already exists" });
    }

    // Generate UUID for guide
    const guideId = uuidv4();

    // Insert into guides table
    await connection.execute(
      `INSERT INTO guides (
                id, user_id, location, languages, specialties, 
                price_per_hour, experience_years, description, 
                rating, total_reviews, is_available, verification_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        guideId,
        userId,
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
