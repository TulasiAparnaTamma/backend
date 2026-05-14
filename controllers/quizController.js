const Quiz = require('../models/Quiz');

// @desc    Get all quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
exports.getQuizzesByCourse = async (req, res) => {
  try {
    // Exclude actual answers when sending to students
    const isStudent = req.user.role === 'student';
    let quizzes = await Quiz.find({ course: req.params.courseId }).lean();

    if (isStudent) {
      quizzes = quizzes.map(q => {
        const sanitizedQuestions = q.questions.map(question => ({
          _id: question._id,
          questionText: question.questionText,
          options: question.options,
          marks: question.marks
        }));
        return { ...q, questions: sanitizedQuestions, attempts: undefined };
      });
    }

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private/Faculty
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz({
      ...req.body,
      instructor: req.user._id
    });
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private/Student
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionIndex, selectedOptionIndex }
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Check if already attempted
    const hasAttempted = quiz.attempts.find(a => a.student.toString() === req.user._id.toString());
    if (hasAttempted) {
      return res.status(400).json({ message: 'Quiz already attempted' });
    }

    // Auto-grading logic
    let score = 0;
    answers.forEach(ans => {
      const question = quiz.questions[ans.questionIndex];
      if (question && question.correctAnswerIndex === ans.selectedOptionIndex) {
        score += question.marks || 1;
      }
    });

    quiz.attempts.push({
      student: req.user._id,
      score,
      answers
    });

    await quiz.save();
    res.status(200).json({ message: 'Quiz submitted successfully', score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
