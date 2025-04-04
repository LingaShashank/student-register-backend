const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");

const router = express.Router();

async function generateStudentID() {
    const currentYear = new Date().getFullYear();
    const lastStudent = await Student.findOne({ studentID: new RegExp(`^${currentYear}`) })
        .sort({ studentID: -1 });
    
    let newID;
    if (lastStudent) {
        const lastNumber = parseInt(lastStudent.studentID.slice(4), 10);
        newID = `${currentYear}${String(lastNumber + 1).padStart(6, '0')}`;
    } else {
        newID = `${currentYear}000001`;
    }
    
    return newID;
}
// Endpoint to add a single student with validation
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust if birthday hasn't occurred yet this year
    const hasBirthdayPassed =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
        age--;
    }
    return age;
};

// Endpoint to add a student with validation
router.post("/addStudent", async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, gender, email, tenthCGPA, interCGPA, phoneNumber, parentsPhone, address } = req.body;

        // Check if email already exists
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Check if phone numbers are identical
        if (phoneNumber === parentsPhone) {
            return res.status(400).json({ error: "Phone number and parent's phone number cannot be the same" });
        }

        // Check if phone numbers already exist
        const existingPhone = await Student.findOne({
            $or: [{ phoneNumber }, { parentsPhone }]
        });
        if (existingPhone) {
            return res.status(400).json({ error: "Phone number or parent's phone number already exists" });
        }

        // Generate unique student ID
        const studentID = await generateStudentID();

        // Calculate age from date of birth
        const age = calculateAge(dateOfBirth);

        // Create a new student entry
        const newStudent = new Student({
            studentID,
            firstName,
            lastName,
            dateOfBirth,
            age,
            gender,
            email,
            tenthCGPA,
            interCGPA,
            phoneNumber,
            parentsPhone,
            address
        });

        await newStudent.save();
        res.status(201).json({ message: "Student added successfully", studentID });

    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to get all students from the database
router.get("/getAllStudents", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to delete a student by ID
router.delete("/deleteStudent/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await Student.findOneAndDelete({ studentID: id });
        
        if (!deletedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;