const mysql = require('mysql2/promise');  // chú ý thêm 'promise' để dùng async/await

const config = {
    host: 'localhost',
    user: 'root',  // hoặc user bạn tạo, VD: 'tourconnect_user'
    password: 'Tienminh25052004@',
    database: 'TourConnect',
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
