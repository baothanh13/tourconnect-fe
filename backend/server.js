const express = require("express");
const bodyParser = require("body-parser");
const { connectToDB } = require("./config/db");
const authRoutes = require("./routes/auth.Routes");
const bookingRoutes = require("./routes/bookings.Routes");
const guideRoutes = require("./routes/guides.Routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerOptions");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.get("/test", (req, res) => {
  res.send("✅ Backend is reachable at /test");
});

const PORT = process.env.PORT || 5000;

console.log("🚀 Starting TourConnect Backend Server...");
console.log("📊 Environment:", process.env.NODE_ENV || "development");
console.log("🔌 Port:", PORT);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://tourconnect-fe-mu.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(bodyParser.json());

// ⚠️ ĐƯA health check RA NGOÀI connectToDB
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "TourConnect Backend is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Luôn chạy server - kể cả khi DB lỗi
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
});

// DB connect & gán route sau
connectToDB()
  .then((connection) => {
    if (connection) {
      console.log("✅ Database connected successfully");
      app.locals.db = connection;
    } else {
      console.warn("⚠️ Database connection failed");
      app.locals.db = null;
    }

    // Routes
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
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });
