const { connectToDB } = require("../../config/db");

const getAllGuides = async (req, res) => {
    try {
        const connection = await connectToDB();

        const [rows] = await connection.execute(
            `SELECT * FROM guides`
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching guides:", err);
        res.status(500).json({ 
            message: "Error fetching guides", 
            error: err.message 
        });
    }
};

module.exports = getAllGuides;