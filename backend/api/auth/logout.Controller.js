const logout = (req, res) => {
    // Nếu có sử dụng token thì xóa ở client (hoặc blacklist token nếu cần)
    return res.json({ message: 'Logout successful' });
};

module.exports = logout;
