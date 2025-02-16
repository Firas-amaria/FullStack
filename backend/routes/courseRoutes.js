const express = require("express");
const Course = require("../models/Course");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Create a New Course (Instructor Only)
 */
router.post(
  "/",
  authenticateUser,
  authorizeRole(["instructor"]),
  async (req, res) => {
    try {
      const { title, description, materials } = req.body;
      const newCourse = new Course({
        title,
        description,
        materials,
        instructor: req.user.userId, // Instructor is the logged-in user
      });

      await newCourse.save();
      res
        .status(201)
        .json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * ✅ Get All Courses (Public - Anyone Can View)
 */


router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "instructor",
      "username email"
    );//fetch instructor details
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

/**
 * ✅ Get a Specific Course by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "username email"
    );
    if (!course) return res.status(404).json({ error: "Course not found" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ✅ Update a Course (Instructor Only)
 */
router.patch(
  "/:id",
  authenticateUser,
  authorizeRole(["instructor"]),
  async (req, res) => {
    try {
      const { title, description, materials } = req.body;
      const updatedCourse = await Course.findOneAndUpdate(
        { _id: req.params.id, instructor: req.user.userId }, // Only allow the course instructor to update
        { title, description, materials },
        { new: true }
      );

      if (!updatedCourse)
        return res
          .status(403)
          .json({ error: "Unauthorized to update this course" });

      res.json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * ✅ Delete a Course (Instructor or Admin)
 */
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["instructor", "admin"]),
  async (req, res) => {
    try {
      const deletedCourse = await Course.findOneAndDelete({
        _id: req.params.id,
        instructor: req.user.role === "admin" ? undefined : req.user.userId,
      });

      if (!deletedCourse)
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this course" });

      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
