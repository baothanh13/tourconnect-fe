const { pool } = require("../../config/db");

async function updateCertificateImage(req, res) {
  try {
    const { userId } = req.params;
    let { certificate_img } = req.body;

    // Đảm bảo certificate_img là array
    if (!Array.isArray(certificate_img)) {
      return res.status(400).json({
        success: false,
        message: "certificate_img must be an array of URLs"
      });
    }

    // Kiểm tra guide có tồn tại không
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

    // Cập nhật ảnh chứng chỉ (lưu JSON string vào DB)
    const [result] = await pool.execute(
      "UPDATE guides SET certificate_img = ? WHERE user_id = ?",
      [JSON.stringify(certificate_img), userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to update certificate images"
      });
    }

    res.json({
      success: true,
      message: "Certificate images updated successfully",
      data: {
        userId,
        certificate_img // trả về array luôn
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
