const express = require("express");
const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 *  Create a New Quiz (Instructors Only)
 */
router.post(
  "/:courseId",
  authenticateUser,
  authorizeRole(["instructor"]),
  async (req, res) => {
    try {
      const { questions } = req.body;
      const course = await Course.findById(req.params.courseId);
      if (!course) return res.status(404).json({ error: "Course not found" });

      const newQuiz = new Quiz({
        course: req.params.courseId,
        questions,
      });

      await newQuiz.save();
      res
        .status(201)
        .json({ message: "Quiz created successfully", quiz: newQuiz });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get All Quizzes for a Course
 */
router.get("/:courseId", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 *  Get a Specific Quiz by ID
 */
router.get("/quiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
