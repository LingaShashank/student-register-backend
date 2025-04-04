const express = require("express");
const cors = require("cors");
const connectToMongo = require("./connectors/mongoConnectors");
const path = require("path");
const studentController = require("./controllers/studentController");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Database connection check//
connectToMongo().then((db) => {
    db.once("open", () => {
        console.log("Database connection is open.");
    });

    db.on("error", (err) => {
        console.error("Database connection error:", err);
    });
});


/*******************************************************************************/ 
/********************************ROUTERS****************************************/
/*******************************************************************************/
app.use("/api/students", studentController);

app.get("/", (req, res) => {
    res.send({ message: "Your Backend API is working properly" })
});

app.use(express.static(path.join(__dirname, "public")));

// Start server
const PORT = 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const updateStudentAges = async () => {
    try {
        console.log("Updating student ages...");

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDate = today.getDate();

        // Find all students
        const students = await Student.find();

        for (let student of students) {
            const birthDate = new Date(student.dateOfBirth);
            let newAge = currentYear - birthDate.getFullYear();

            // Check if the student's birthday has occurred this year
            if (currentMonth < birthDate.getMonth() || 
                (currentMonth === birthDate.getMonth() && currentDate < birthDate.getDate())) {
                newAge--; // Decrease age if birthday hasn't happened yet
            }

            // Only update the document if the age has changed
            if (student.age !== newAge) {
                await Student.updateOne({ _id: student._id }, { $set: { age: newAge } });
                console.log(`Updated age for ${student.firstName} ${student.lastName} to ${newAge}`);
            }
        }

        console.log("Student age update process completed.");
    } catch (error) {
        console.error("Error updating student ages:", error);
    }
};

// Schedule the job to run every day at midnight (00:00)
cron.schedule("0 0 * * *", updateStudentAges, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Set timezone if needed
});

// Run the function once when the server starts (optional)
updateStudentAges();

