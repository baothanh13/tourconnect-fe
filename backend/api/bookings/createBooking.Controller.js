const { connectToDB } = require('../../config/db');

const createBooking = async (req, res) => {
    const { guide_id, tour_id, booking_date, total_amount } = req.body;
    const user_id = req.user.user_id;  // lấy từ token (middleware verifyToken đã decode sẵn)

    try {
        const connection = await connectToDB();

        // Insert Booking
        const [result] = await connection.execute(
            `INSERT INTO Booking (guide_id, user_id, booking_date, tour_id, tour_title, status, total_amount, payment_status)
             SELECT ?, ?, ?, t.tour_id, t.title, 'pending', ?, 'unpaid'
             FROM Tour t WHERE t.tour_id = ?`,
            [guide_id, user_id, booking_date, total_amount, tour_id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Invalid Tour ID' });
        }

        res.status(201).json({ message: 'Booking created successfully', booking_id: result.insertId });

    } catch (err) {
        console.error('Create Booking Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = createBooking;
