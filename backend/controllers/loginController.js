const { sql } = require('../database/db');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await sql.query`
            SELECT * FROM Customer WHERE Email = ${email} AND Password = ${password}
        `;

        if (result.recordset.length > 0) {
            res.status(200).json({ message: 'Login successful!', user: result.recordset[0] });
        } else {
            res.status(401).json({ message: 'Invalid email or password!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed!' });
    }
};

module.exports = { login };
