const { pool } = require("../../config/db");

async function updateCertificateImage(req, res) {
  try {
    const { userId } = req.params;
    const { certificate_img } = req.body;

    // Kiểm tra xem guide có tồn tại không
    const [guideCheck] = await pool.execute(
      "SELECT id FROM guides WHERE user_id = ?",
      [userId]
    );

    if (guideCheck.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Guide not found" 
      });
    }

    // Cập nhật ảnh chứng chỉ
    const [result] = await pool.execute(
      "UPDATE guides SET certificate_img = ? WHERE user_id = ?",
      [certificate_img, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Failed to update certificate image" 
      });
    }

    res.json({
      success: true,
      message: "Certificate image updated successfully",
      data: {
        userId,
        certificate_img
      }
    });

  } catch (err) {
    console.error("Error updating certificate image:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

module.exports = updateCertificateImage;
