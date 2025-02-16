const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Enroll in a Course (Students Only)
 */



router.post(
  "/:courseId",
  authenticateUser,
  authorizeRole(["student"]),
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ error: "Course not found" });

      // Check if the student is already enrolled
      const existingEnrollment = await Enrollment.findOne({
        student: req.user.userId,
        course: req.params.courseId,
      });

      if (existingEnrollment)
        return res
          .status(400)
          .json({ error: "Already enrolled in this course" });

      const enrollment = new Enrollment({
        student: req.user.userId,
        course: req.params.courseId,
      });

      await enrollment.save();
      res.status(201).json({ message: "Enrollment successful!", enrollment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * ✅ Get All Enrolled Courses for a Student
 */


router.get(
  "/my-courses",
  authenticateUser,
  authorizeRole(["student"]),
  async (req, res) => {
    try {
      const enrollments = await Enrollment.find({ student: req.user.userId })
        .populate({
          path: "course",
          populate: { path: "instructor", select: "username email" }, // ✅ Ensure "username" is fetched
          select: "title materials instructor", // ✅ Fetch only required fields
        });

      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/*
router.get(
  "/my-courses",
  authenticateUser,
  authorizeRole(["student"]),
  async (req, res) => {
    try {
      console.log("User data:", req.user); // 🔍 Debugging Line

      if (!req.user || !req.user.userId) {
        return res.status(400).json({ error: "Missing student ID" });
      }

      const enrollments = await Enrollment.find({
        student: req.user.userId,
      }).populate("course");

      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
*/
/**
 * ✅ Get All Enrolled Students for a Course (Instructor Only)
 */
router.get(
  "/course/:courseId",
  authenticateUser,
  authorizeRole(["instructor"]),
  async (req, res) => {
    try {
      const enrollments = await Enrollment.find({
        course: req.params.courseId,
      }).populate("student", "username email");
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
