const { connectToDB } = require("../../config/db");

// A helper function to safely parse data that might not be valid JSON
const parseJSONSafely = (data) => {
  // If the data is empty or not a string, return an empty array
  if (!data || typeof data !== "string") {
    return [];
  }
  try {
    // If it's valid JSON, parse and return it
    return JSON.parse(data);
  } catch (e) {
    // If it's just a plain string (like "Vietnamese"), return it inside an array
    return [data];
  }
};

const getGuideByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const connection = await connectToDB();

    const [guides] = await connection.execute(
      `SELECT 
        g.*,
        u.name,
        u.email,
        u.phone,
        u.avatar_url,
        u.created_at as user_created_at
      FROM guides g 
      JOIN users u ON g.user_id = u.id 
      WHERE g.user_id = ?`,
      [userId]
    );

    if (guides.length === 0) {
      return res.status(404).json({ message: "Guide profile not found" });
    }

    const guide = guides[0];

    // --- FINAL FIX ---
    // Use the safe parsing function for all fields that should be arrays
    const guideData = {
      ...guide,
      languages: parseJSONSafely(guide.languages),
      specialties: parseJSONSafely(guide.specialties),
      certificates: parseJSONSafely(guide.certificates),
    };

    return res.json(guideData);
  } catch (err) {
    console.error("Get Guide Error:", err);
    // Send back the actual error in the response to make future debugging easier
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = getGuideByUserId;
