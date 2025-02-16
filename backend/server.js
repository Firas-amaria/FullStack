require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Environment Variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/LMS-System";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// Logging Middleware (Keep only one)
app.use((req, res, next) => {
  console.log(`🔍 Received ${req.method} request to ${req.url}`);
  next();
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const { authenticateUser } = require("./middleware/authMiddleware");

app.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});

const courseRoutes = require("./routes/courseRoutes");
app.use("/courses", courseRoutes);


const enrollmentRoutes = require("./routes/enrollmentRoutes");
app.use("/enrollments", enrollmentRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/quizzes", quizRoutes);

const submissionRoutes = require("./routes/submissionRoutes");
app.use("/submissions", submissionRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
