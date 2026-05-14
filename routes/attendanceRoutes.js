const express = require('express');
const router = express.Router();
const { getAttendance, saveAttendance } = require('../controllers/attendanceController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/:courseId')
  .get(protect, faculty, getAttendance)
  .post(protect, faculty, saveAttendance);

module.exports = router;
