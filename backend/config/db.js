const sql = require('mssql');

const config = {
    user: 'tourconnect_user', 
    password: 'Tienminh25052004@', 
    server: 'localhost', 
    database: 'TourConnect', 
    options: {
        encrypt: false,
        trustServerCertificate: true 
    }
};

async function connectToDB() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed: ', err);
    }
}

module.exports = {
    sql,
    connectToDB
};
