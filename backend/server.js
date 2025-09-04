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
const touristRoutes = require("./routes/tourist.Routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerOptions");
const cors = require("cors");
const path = require("path");

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

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Kết nối DB 1 lần để đảm bảo pool hoạt động
connectToDB()
  .then(() => {
    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/guides", guideRoutes);
    app.use("/api/bookings", bookingRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/supportTickets", supportTicketsRoutes);
    app.use("/api/tours", tourRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/tourist", touristRoutes);

    // ✅ Chỉ listen một lần
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      console.log(`📖 Swagger UI available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  });
