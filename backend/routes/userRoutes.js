const express = require("express");
const User = require("../models/User"); // Make sure the User model is imported
const router = express.Router();

/**
 * ✅ Get instructor details by IDs
 */
router.post("/instructors", async (req, res) => {
    try {
        const { instructorIds } = req.body;
        if (!instructorIds || !Array.isArray(instructorIds)) {
            return res.status(400).json({ error: "Invalid instructor IDs" });
        }

        const instructors = await User.find(
            { _id: { $in: instructorIds } },
            "name _id" // Return only name and ID
        );

        res.json(instructors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch instructors" });
    }
});


/**
 * ✅ Get student details by IDs
 */
router.post("/students", async (req, res) => {
    try {
        const { studentIds } = req.body;
        if (!studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ error: "Invalid student IDs" });
        }

        const students = await User.find(
            { _id: { $in: studentIds } },
            "name _id" // Return only name and ID
        );

        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

module.exports = router;
