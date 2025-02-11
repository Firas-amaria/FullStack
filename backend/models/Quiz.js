const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lectureName: { type: String, required: true },
    instructorName: { type: String, required: true }, // שם המרצה
    questions: [
        {
            question: { type: String, required: true },
            options: { type: [String], required: true }, // אפשרויות השאלה
            correctAnswer: { type: String, required: true }, // תשובה נכונה
        }
    ]
}); 

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
