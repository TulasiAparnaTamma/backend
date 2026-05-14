const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  videoUrl: String,
  pdfUrl: String,
  duration: Number, // in minutes
  order: Number
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  lessons: [lessonSchema],
  order: Number
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a course description']
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/800x600'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modules: [moduleSchema],
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      completedLessons: [mongoose.Schema.Types.ObjectId], // Array of completed lesson IDs
      percentage: {
        type: Number,
        default: 0
      }
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
