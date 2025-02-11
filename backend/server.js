// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// const PORT = process.env.PORT || 3000;
// const MONGO_URI =
//   process.env.MONGO_URI || "mongodb://localhost:27017/LMS-System";

// // Connect to MongoDB
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log(" Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// const authRoutes = require("./routes/authRoutes");
// app.use("/auth", authRoutes);

// const { authenticateUser } = require("./middleware/authMiddleware");

// app.get("/protected", authenticateUser, (req, res) => {
//   res.json({ message: "Protected route accessed!", user: req.user });
// });

// const courseRoutes = require("./routes/courseRoutes");
// app.use("/courses", courseRoutes);

// const enrollmentRoutes = require("./routes/enrollmentRoutes");
// app.use("/enrollments", enrollmentRoutes);

// const quizRoutes = require("./routes/quizRoutes");
// app.use("/quizzes", quizRoutes);

// const submissionRoutes = require("./routes/submissionRoutes");
// app.use("/submissions", submissionRoutes);

// const adminRoutes = require("./routes/adminRoutes");
// app.use("/admin", adminRoutes);

require("dotenv").config();
const express = require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const path=require("path");

const app=express();
app.use(express.json());
app.use(cors());



const PORT =process.env.PORT || 3000;
const MONGO_URI = "mongodb://localhost:27017/LearningSystem";

mongoose.connect(MONGO_URI)
    .then(()=>console.log("Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
const User = require("./models/User");
const Quiz = require("./models/Quiz"); 
const Course = require("./models/Course");  // בודק אם יש כאן יותר מפעם אחת







// יצירת משתמש חדש
// יצירת משתמש חדש
app.post("/users", async (req, res) => {
    try {
        const { customId, name, email, password } = req.body;

        // בדיקת אם המייל כבר קיים
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "יש כבר משתמש עם אימייל זה" });
        }

        const user = new User({ customId, name, email, password, admin: 0 }); // admin=0
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user by ID
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID
app.patch("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


  
// הוספת מבחן חדש למסד נתונים
app.post("/quizzes", async (req, res) => {
    try {
        const { title, lectureName, questions } = req.body;

        // יצירת מבחן חדש במסד נתונים
        const quiz = new Quiz({ title, lectureName, questions });
        await quiz.save();

        res.status(201).json(quiz);  // מחזירים את המבחן שנוצר
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// הוספת קורס חדש
app.post("/courses", async (req, res) => {
    try {
        const { courseName, courseDescription, instructorName } = req.body;

        // יצירת קורס חדש
        const course = new Course({ courseName, courseDescription, instructorName });
        await course.save();

        res.status(201).json(course);  // מחזירים את הקורס שנוצר
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Serve favicon if it exists
app.use("/favicon.ico", express.static(path.join(__dirname, "frontend", "favicon.ico")));

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}); 