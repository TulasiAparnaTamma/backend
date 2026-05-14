const Assignment = require('../models/Assignment');

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Faculty
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      instructor: req.user._id
    });
    const createdAssignment = await assignment.save();
    res.status(201).json(createdAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
exports.submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = Date.now();
    } else {
      assignment.submissions.push({
        student: req.user._id,
        fileUrl,
        status: new Date() > assignment.dueDate ? 'late' : 'submitted'
      });
    }

    await assignment.save();
    res.status(200).json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade a submission
// @route   PUT /api/assignments/:id/grade/:studentId
// @access  Private/Faculty
exports.gradeSubmission = async (req, res) => {
  try {
    const { marksObtained, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    if (assignment.instructor.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized' });
    }

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === req.params.studentId
    );

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.marksObtained = marksObtained;
    submission.feedback = feedback;
    submission.status = 'graded';

    await assignment.save();
    res.status(200).json({ message: 'Submission graded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
