const express = require("express");
const Course = require("../models/Course");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

/**
 * ✅ Get Courses Created by the Logged-in Instructor
 * Route: GET /instructor/courses
 * Access: Instructor Only
 */
router.get(
  "/courses",
  authenticateUser,
  authorizeRole(["instructor"]),
  async (req, res) => {
    try {
      const instructorId = new mongoose.Types.ObjectId(req.user.userId); // Convert to ObjectId

      const courses = await Course.find({ instructor: instructorId });

      res.json(courses);
    } catch (error) {
      console.error("❌ Error fetching instructor courses:", error);
      res.status(500).json({ error: "Failed to retrieve courses." });
    }
  }
);

module.exports = router;
