const express = require("express");
const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();
// הוספת מבחן חדש למסד נתונים
router.post("/quizzes", async (req, res) => {
  try {
      const { title, lectureName, questions } = req.body;
      const quiz = new Quiz({ title, lectureName, questions });
      await quiz.save();
      res.status(201).json(quiz);
  } catch (error) {
      console.log(error);  // הדפס את השגיאה
      res.status(400).json({ error: error.message });
  }
});


module.exports = router;
