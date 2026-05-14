const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @desc    Get attendance for a course by date
// @route   GET /api/attendance/:courseId?date=YYYY-MM-DD
// @access  Private/Faculty
exports.getAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view attendance for this course' });
    }

    let query = { course: courseId };
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const attendance = await Attendance.find(query).populate('records.student', 'name email avatar');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save daily attendance
// @route   POST /api/attendance/:courseId
// @access  Private/Faculty
exports.saveAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date, records } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to take attendance for this course' });
    }

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      course: courseId,
      date: targetDate
    });

    if (attendance) {
      // Update existing record
      attendance.records = records;
      await attendance.save();
    } else {
      // Create new record
      attendance = new Attendance({
        course: courseId,
        date: targetDate,
        records
      });
      await attendance.save();
    }

    res.status(200).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance for this date already exists.' });
    }
    res.status(500).json({ message: error.message });
  }
};
