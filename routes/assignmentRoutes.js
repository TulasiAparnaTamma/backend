const express = require('express');
const router = express.Router();
const { getAssignmentsByCourse, createAssignment, submitAssignment, gradeSubmission } = require('../controllers/assignmentController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, faculty, createAssignment);

router.route('/course/:courseId')
  .get(protect, getAssignmentsByCourse);

router.route('/:id/submit')
  .post(protect, submitAssignment);

router.route('/:id/grade/:studentId')
  .put(protect, faculty, gradeSubmission);

module.exports = router;
