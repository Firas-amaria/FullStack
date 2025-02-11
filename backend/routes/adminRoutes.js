const express = require("express");
const User = require("../models/User");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Get All Users (Admin Only)
 */
router.get(
  "/users",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find({}, "-password"); // Exclude passwords
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * ✅ Delete a User (Admin Only)
 */
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
