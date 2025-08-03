const { sql } = require('../database/db');

const register = async (req, res) => {
    const { email, password, name, phone, address } = req.body;

    try {
        const result = await sql.query`
            INSERT INTO Customer (Auth, Email, Password, Name, Phone, Address)
            VALUES ((SELECT ISNULL(MAX(Auth), 0) + 1 FROM Customer), ${email}, ${password}, ${name}, ${phone})
        `;
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed!' });
    }
};

module.exports = { register };
