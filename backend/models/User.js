const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    customId: { 
        type: String, 
        unique: true,  
        required: true,
        match: [/^\d{9}$/, 'Custom ID should be exactly 9 digits']  // אימות ID שמורכב מ-9 ספרות
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']  // אימות דואר אלקטרוני
    },
    password: { 
        type: String, 
        required: true 
    },
    admin: { 
        type: Number, 
        default: 0 // ברירת מחדל 0 (משתמש רגיל)
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("User", userSchema);
