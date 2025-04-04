const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    studentID: {
        type: String,
        unique: true, // Ensure studentID remains unique
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    tenthCGPA: { type: Number, required: true },
    interCGPA: { type: Number, required: true },
    phoneNumber: { type: String, unique: true, required: true },
    parentsPhone: { type: String, unique: true, required: true },
    address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Student", StudentSchema);
