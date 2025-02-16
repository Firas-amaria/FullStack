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

// route לשליפת כל הקורסים
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find(); 
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

rrouter.get('/courses/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "הפרמטר query חסר" });
    }

    // בדוק אם השאילתא מחפשת לפי שם הקורס ולא ב-ID
    const courses = await Course.find({ 
      courseName: { $regex: query, $options: "i" } // חיפוש לפי שם קורס
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ שגיאה בחיפוש קורסים:", error.stack);
    res.status(500).json({ error: error.message });
  }
});



// Route למחיקת קורס
router.delete("/courses/:courseId", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.status(200).send("Course deleted successfully");
  } catch (err) {
    res.status(500).send("Error deleting course");
  }
});



// Route לעדכון קורס
router.put('/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { courseName, courseDescription } = req.body;

    const course = await Course.findByIdAndUpdate(courseId, { courseName, courseDescription }, { new: true });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route לשליפת קורס לפי ה-ID שלו
router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
