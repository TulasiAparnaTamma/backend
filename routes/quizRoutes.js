const express = require('express');
const router = express.Router();
const { getQuizzesByCourse, createQuiz, submitQuiz } = require('../controllers/quizController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, faculty, createQuiz);

router.route('/course/:courseId')
  .get(protect, getQuizzesByCourse);

router.route('/:id/submit')
  .post(protect, submitQuiz);

module.exports = router;
