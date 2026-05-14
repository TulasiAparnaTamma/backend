const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  marks: {
    type: Number,
    default: 1
  }
});

const attemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedOptionIndex: Number
  }],
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [questionSchema],
  durationMinutes: {
    type: Number,
    required: true
  },
  startTime: Date,
  endTime: Date,
  attempts: [attemptSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
