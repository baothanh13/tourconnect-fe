require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { connectToDB } = require("./config/db");
const authRoutes = require("./routes/auth.Routes");
const bookingRoutes = require("./routes/bookings.Routes");
const guideRoutes = require("./routes/guides.Routes");
const adminRoutes = require("./routes/admin.Routes");
const supportTicketsRoutes = require("./routes/supportTickets.Routes");
const tourRoutes = require("./routes/tour.Routes");
const reviewRoutes = require("./routes/review.Routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerOptions");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ✅ Bật CORS ở đầu
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "TourConnect Backend is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Kết nối DB và gán routes
connectToDB()
  .then((connection) => {
    app.locals.db = connection;

    app.use(
      "/api/auth",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      authRoutes
    );
    app.use(
      "/api/guides",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      guideRoutes
    );
    app.use(
      "/api/bookings",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      bookingRoutes
    );
    app.use(
      "/api/admin",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      adminRoutes
    );
    app.use(
      "/api/supportTickets",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      supportTicketsRoutes
    );
    app.use(
      "/api/tours",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      tourRoutes
    );
    app.use(
      "/api/reviews",
      (req, res, next) => {
        req.db = app.locals.db;
        next();
      },
      reviewRoutes
    );
    // ✅ Chỉ listen một lần
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
