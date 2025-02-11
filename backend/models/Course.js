const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    courseDescription: { type: String, required: true },
    instructorName: { type: String, required: true },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
