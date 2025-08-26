const { connectToDB } = require("../../config/db");

const approveGuide = async (req, res) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; // 'verified', 'rejected' hoặc 'pending' 

        if (!["verified", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'verified' or 'rejected' or 'pending'" });
        }

        const connection = await connectToDB();

        const [result] = await connection.execute(
            `UPDATE guides 
             SET verification_status = ? 
             WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Guide not found" });
        }

        return res.status(200).json({
            message: `Guide has been ${status}`,
            guideId: id,
            newStatus: status
        });

    } catch (error) {
        console.error("Error approving guide:", error);
        return res.status(500).json({
            message: "Error approving guide",
            error: error.message,
        });
    }
};

module.exports = approveGuide;