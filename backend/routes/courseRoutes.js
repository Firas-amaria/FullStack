const express = require("express");
const Course = require("../models/Course");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Create a New Course (Instructor Only)
 */
router.post("/", async (req, res) =>{
  try {
      const { courseName, courseDescription, instructorID } = req.body;

      // יצירת קורס חדש
      const course = new Course({ courseName, courseDescription, instructorID });
      await course.save();

      res.status(201).json(course);  // מחזירים את הקורס שנוצר
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});

// route לשליפת הקורסים של מורה לפי ה- ID שלו
router.get('/courses/instructor/:instructorID', async (req, res) => {
  try {
    const { instructorID } = req.params;
    const courses = await Course.find({ instructorID: instructorID });
    res.status(200).json(courses); // החזר את הקורסים למערכת
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
