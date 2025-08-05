require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function connectToDB() {
    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL');
        return connection;  // trả về connection để file khác có thể dùng
    } catch (err) {
        console.error('Database connection failed: ', err);
    }
}

module.exports = {
    connectToDB
};
