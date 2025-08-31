async function getGuideByUserId(req, res) {
  try {
    const { userId } = req.params;
    const connection = req.db;

    // First, let's check if the certificate_img column exists
    let query = `SELECT g.id,
              g.user_id,
              u.name AS user_name, 
              u.email AS user_email,
              u.phone,
              g.location,
              g.languages,
              g.specialties,
              g.price_per_hour,
              g.experience_years,
              g.description,
              g.certificates,
              g.rating,
              g.total_reviews,
              g.is_available,
              g.current_location,
              g.verification_status`;

    // Try to add certificate_img if it exists
    try {
      await connection.execute("SELECT certificate_img FROM guides LIMIT 1");
      query += `,\n              g.certificate_img`;
    } catch (columnError) {
      console.log("certificate_img column not found, skipping...");
    }

    query += `\n       FROM guides g
       JOIN users u ON g.user_id = u.id
       WHERE g.user_id = ?;`;

    const [rows] = await connection.execute(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Guide not found" });
    }

    // If certificate_img doesn't exist, set it to null
    const guide = rows[0];
    if (!guide.hasOwnProperty("certificate_img")) {
      guide.certificate_img = null;
    }

    res.json(guide);
  } catch (err) {
    console.error("Error fetching guide by userId:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = getGuideByUserId;
