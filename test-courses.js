const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/learnova').then(async () => {
    try {
        console.log("Connected to DB");
        const courses = await Course.find({ status: 'published' }).populate('instructor', 'name avatar');
        console.log("Success", courses.length);
    } catch(e) {
        console.error("ERROR", e);
    }
    process.exit(0);
});
