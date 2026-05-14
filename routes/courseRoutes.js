const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourseById, 
  createCourse, 
  updateCourse,
  enrollCourse
} = require('../controllers/courseController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCourses)
  .post(protect, faculty, createCourse);

router.route('/:id')
  .get(protect, getCourseById)
  .put(protect, faculty, updateCourse);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

router.route('/:id/enroll-student')
  .post(protect, faculty, require('../controllers/courseController').enrollStudent);

module.exports = router;
