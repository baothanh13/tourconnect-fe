const { pool } = require("../../config/db");

const getTouristUpcomingTours = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    // Check if tourist exists
    const [touristRows] = await pool.execute(
      `SELECT id, name FROM users WHERE id = ? AND role = 'tourist'`,
      [touristId]
    );

    if (touristRows.length === 0) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Count total upcoming bookings
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
       FROM bookings b
       WHERE b.tourist_id = ? 
       AND b.status IN ('confirmed', 'pending')
       AND b.booking_date >= CURDATE()`,
      [touristId]
    );

    const totalUpcomingBookings = countResult[0].total;

    // Get upcoming bookings with details
    const [upcomingTours] = await pool.execute(
      `SELECT 
         b.id as booking_id,
         b.booking_date,
         b.status,
         b.total_price,
         b.number_of_tourists,
         b.special_requests,
         b.created_at as booking_created_at,
         g.id as guide_id,
         gu.name as guide_name,
         gu.email as guide_email,
         gu.phone as guide_phone
       FROM bookings b
       JOIN guides g ON b.guide_id = g.id
       JOIN users gu ON g.user_id = gu.id
       WHERE b.tourist_id = ? 
       AND b.status IN ('confirmed', 'pending')
       AND b.booking_date >= CURDATE()
       ORDER BY b.booking_date ASC, b.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
      [touristId]
    );

    const formattedBookings = upcomingTours.map((b) => ({
      booking_id: b.booking_id,
      booking_date: b.booking_date,
      status: b.status,
      total_price: b.total_price,
      number_of_people: b.number_of_people,
      special_requirements: b.special_requirements,
      booking_created_at: b.booking_created_at,
      tour: {
        id: b.tour_id,
        title: b.tour_title,
        description: b.tour_description,
        duration: b.duration,
        price: b.price,
        location: b.tour_location,
        image_url: b.tour_image,
        max_people: b.max_people,
      },
      guide: {
        id: b.guide_id,
        name: b.guide_name,
        email: b.guide_email,
        phone: b.guide_phone,
        rating: b.guide_rating,
        total_reviews: b.guide_total_reviews,
        location: b.guide_location,
        languages: b.guide_languages,
        specialties: b.guide_specialties,
        price_per_hour: b.guide_price_per_hour,
      },
    }));

    const totalPages = Math.ceil(totalUpcomingBookings / limit);

    res.json({
      upcoming_Tours: formattedBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUpcomingBookings,
        limit: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getTouristUpcomingTours };
