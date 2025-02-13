const express = require("express");
const User = require("../models/User");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 *  Get All Users (Admin Only)
 */
router.get(
  "/users",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find().select("username email role createdAt");
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

/**
 *  Delete a User (Admin Only)
 */
router.delete(
  "/users/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if the ID is valid
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

router.patch(
  "/users/:id/role",
  authenticateUser,
  authorizeRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!["student", "instructor"].includes(role)) {
        return res.status(400).json({ error: "Invalid role provided" });
      }

      // Update role
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({ message: `User role updated to ${role}`, user });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
);

module.exports = router;
