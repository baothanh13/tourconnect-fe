const express = require('express');
const bodyParser = require('body-parser');
const { connectToDB } = require('./config/db');
const authRoutes = require('./routes/auth.Routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Kết nối DB rồi mới start server
connectToDB().then((connection) => {
    if (connection) {
        // Lưu connection vào app.locals để các route có thể dùng
        app.locals.db = connection;

        // Routes
        // Truyền app vào routes để bên routes dùng app.locals.db nếu cần
        app.use('/api/auth', (req, res, next) => {
            req.db = app.locals.db;  // truyền db connection vào request
            next();
        }, authRoutes);

        // Start Server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } else {
        console.error('Failed to connect to database, server not started.');
    }
});
