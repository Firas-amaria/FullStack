const express = require("express");
const Submission = require("../models/Submission");
const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 *  Submit a Quiz (Students Only)
 */
router.post(
  "/:quizId",
  authenticateUser,
  authorizeRole(["student"]),
  async (req, res) => {
    try {
      const { answers } = req.body;
      const quiz = await Quiz.findById(req.params.quizId);
      if (!quiz) return res.status(404).json({ error: "Quiz not found" });

      // Calculate the score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index]?.selectedAnswer === question.correctAnswer) {
          score += 1; // +1 for each correct answer
        }
      });

      const submission = new Submission({
        student: req.user.userId,
        course: quiz.course,
        quiz: req.params.quizId,
        answers,
        score,
      });

      await submission.save();
      res
        .status(201)
        .json({ message: "Quiz submitted successfully!", submission });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get All Submissions for a Student
 */
router.get(
  "/my-submissions",
  authenticateUser,
  authorizeRole(["student"]),
  async (req, res) => {
    try {
      const submissions = await Submission.find({
        student: req.user.userId,
      }).populate("quiz");
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 *  Get All Submissions for a Quiz (Instructor Only)
 */
router.get(
  "/quiz/:quizId",
  authenticateUser,
  authorizeRole(["instructor"]),
  async (req, res) => {
    try {
      const submissions = await Submission.find({
        quiz: req.params.quizId,
      }).populate("student", "username email");
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
