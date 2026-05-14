const mongoose = require('mongoose');

const libraryResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['ebook', 'research_paper', 'journal', 'question_paper', 'notes'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  fileUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LibraryResource', libraryResourceSchema);
