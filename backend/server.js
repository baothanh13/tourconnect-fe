const express = require('express');
const bodyParser = require('body-parser');
const { connectToDB } = require('./config/db');
const authRoutes = require('./routes/auth.Routes');
const bookingRoutes = require('./routes/bookings.Routes');
const guideRoutes = require('./routes/guides.Routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions'); // Import file cấu hình swagger
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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

        app.use('/api/guides', (req, res, next) => {
            req.db = app.locals.db;  // truyền db connection vào request
            next();
        }, guideRoutes);

        app.use('/api/bookings', (req, res, next) => {
            req.db = app.locals.db;  // truyền db connection vào request
            next();
        }, bookingRoutes);

        app.use(cors({
            origin: '*', // Hoặc chỉ định domain frontend nếu muốn
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        // Start Server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('Swagger UI: http://localhost:3000/api-docs');
        });
    } else {
        console.error('Failed to connect to database, server not started.');
    }
});
