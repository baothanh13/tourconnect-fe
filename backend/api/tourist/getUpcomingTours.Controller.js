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

    // Get total count of upcoming tours
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN guides g ON b.guide_id = g.id
       JOIN users gu ON g.user_id = gu.id
       WHERE b.tourist_id = ? 
       AND b.status IN ('confirmed', 'pending')
       AND b.booking_date >= CURDATE()`,
      [touristId]
    );

    const totalUpcomingTours = countResult[0].total;

    // Get upcoming tours with details
    const [upcomingTours] = await pool.execute(
      `SELECT 
         b.id as booking_id,
         b.booking_date,
         b.status,
         b.total_price,
         b.number_of_people,
         b.special_requirements,
         b.created_at as booking_created_at,
         t.id as tour_id,
         t.title as tour_title,
         t.description as tour_description,
         t.duration,
         t.price,
         t.location as tour_location,
         t.image_url as tour_image,
         t.max_people,
         g.id as guide_id,
         gu.name as guide_name,
         gu.email as guide_email,
         gu.phone as guide_phone,
         g.rating as guide_rating,
         g.total_reviews as guide_total_reviews,
         g.location as guide_location,
         g.languages as guide_languages,
         g.specialties as guide_specialties,
         g.price_per_hour as guide_price_per_hour
       FROM bookings b
       JOIN tours t ON b.tour_id = t.id
       JOIN guides g ON b.guide_id = g.id
       JOIN users gu ON g.user_id = gu.id
       WHERE b.tourist_id = ? 
       AND b.status IN ('confirmed', 'pending')
       AND b.booking_date >= CURDATE()
       ORDER BY b.booking_date ASC, b.created_at DESC
       LIMIT ? OFFSET ?`,
      [touristId, parseInt(limit), parseInt(offset)]
    );

    // Format the response
    const formattedTours = upcomingTours.map((tour) => ({
      booking_id: tour.booking_id,
      booking_date: tour.booking_date,
      status: tour.status,
      total_price: tour.total_price,
      number_of_people: tour.number_of_people,
      special_requirements: tour.special_requirements,
      booking_created_at: tour.booking_created_at,
      tour: {
        id: tour.tour_id,
        title: tour.tour_title,
        description: tour.tour_description,
        duration: tour.duration,
        price: tour.price,
        location: tour.tour_location,
        image_url: tour.tour_image,
        max_people: tour.max_people,
      },
      guide: {
        id: tour.guide_id,
        name: tour.guide_name,
        email: tour.guide_email,
        phone: tour.guide_phone,
        rating: tour.guide_rating,
        total_reviews: tour.guide_total_reviews,
        location: tour.guide_location,
        languages: tour.guide_languages,
        specialties: tour.guide_specialties,
        price_per_hour: tour.guide_price_per_hour,
      },
    }));

    const totalPages = Math.ceil(totalUpcomingTours / limit);

    res.json({
      upcoming_tours: formattedTours,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUpcomingTours,
        limit: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching upcoming tours:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getTouristUpcomingTours };
