const { query } = require("../../config/db");

const getSystemActivities = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const activities = await query(`
           (
            SELECT 
                CONCAT('user_create_', u.id) AS id,
                'user' AS type,
                'User Registered' AS title,
                CONCAT('New user registered: ', u.name, ' (', u.email, ')') AS description,
                'created' AS status,
                u.created_at AS timestamp
            FROM users u
            ORDER BY u.created_at DESC
            LIMIT ${limit}
            )
            UNION ALL
            (
            SELECT 
                CONCAT('user_update_', u.id) AS id,
                'user' AS type,
                'User Updated' AS title,
                CONCAT('User updated info: ', u.name, ' (', u.email, ')') AS description,
                'updated' AS status,
                u.updated_at AS timestamp
            FROM users u
            WHERE u.updated_at IS NOT NULL AND u.updated_at <> u.created_at
            ORDER BY u.updated_at DESC
            LIMIT ${limit}
            )
            UNION ALL
            (
            SELECT 
                CONCAT('guide_create_', g.id) AS id,
                'guide' AS type,
                'Guide Profile Created' AS title,
                CONCAT('Guide profile created for ', u.name) AS description,
                'created' AS status,
                u.created_at AS timestamp
            FROM guides g
            JOIN users u ON g.user_id = u.id
            ORDER BY u.created_at DESC
            LIMIT ${limit}
            )
            UNION ALL
            (
            SELECT 
                CONCAT('guide_verify_', g.id) AS id,
                'guide' AS type,
                'Guide Verification Updated' AS title,
                CONCAT('Guide ', u.name, ' status changed to ', g.verification_status) AS description,
                g.verification_status AS status,
                u.updated_at AS timestamp
            FROM guides g
            JOIN users u ON g.user_id = u.id
            ORDER BY u.updated_at DESC
            LIMIT ${limit}
            )
            UNION ALL
            (
            SELECT 
                CONCAT('booking_create_', b.id) AS id,
                'booking' AS type,
                'New Booking Created' AS title,
                CONCAT('Booking by ', tu.name, ' on ', DATE_FORMAT(b.booking_date, '%M %d, %Y')) AS description,
                b.status AS status,
                b.created_at AS timestamp
            FROM bookings b
            JOIN users tu ON b.tourist_id = tu.id
            ORDER BY b.created_at DESC
            LIMIT ${limit}
            )
            UNION ALL
            (
            SELECT 
                CONCAT('booking_update_', b.id) AS id,
                'booking' AS type,
                'Booking Status Updated' AS title,
                CONCAT('Booking status changed to ', b.status, ' by ', tu.name) AS description,
                b.status AS status,
                b.created_at AS timestamp  -- nếu có updated_at thì thay vào đây
            FROM bookings b
            JOIN users tu ON b.tourist_id = tu.id
            ORDER BY b.created_at DESC
            LIMIT ${limit}
            )
            ORDER BY timestamp DESC
            LIMIT ${limit}
        `,
        );
         

        res.status(200).json({ activities });
    } catch (err) {
        res.status(500).json({ message: "Error fetching system activities", error: err.message });
    }
}

module.exports = getSystemActivities;