const mongoose = require("mongoose");

const connectToMongo = async () => {
    const uri = "mongodb+srv://admin:ZYPCgQeuL01Ok0LC@cluster0.ow1qh.mongodb.net/";
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB - Student Registration");
    } catch (err) {
        console.error("Could not connect to MongoDB - Student Registration", err);
    }

    return mongoose.connection; 
};

module.exports = connectToMongo;