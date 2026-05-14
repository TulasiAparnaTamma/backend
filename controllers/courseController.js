const Course = require('../models/Course');

// @desc    Get all published courses (Catalog)
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    let query = { status: 'published' };
    
    // Search functionality
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    
    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    const courses = await Course.find(query).populate('instructor', 'name avatar');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name avatar');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Faculty
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, tags, thumbnail, status, modules } = req.body;

    const course = new Course({
      title,
      description,
      category,
      tags,
      thumbnail,
      status: status || 'draft',
      modules: modules || [],
      instructor: req.user._id
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Faculty
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Ensure only the instructor or admin can update
      if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this course' });
      }

      course.title = req.body.title || course.title;
      course.description = req.body.description || course.description;
      course.category = req.body.category || course.category;
      course.tags = req.body.tags || course.tags;
      course.thumbnail = req.body.thumbnail || course.thumbnail;
      course.status = req.body.status || course.status;
      course.modules = req.body.modules || course.modules;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.find(
      (s) => s.student.toString() === req.user._id.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push({
      student: req.user._id,
      progress: { completedLessons: [], percentage: 0 }
    });

    await course.save();
    res.status(200).json({ message: 'Successfully enrolled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Faculty enroll a specific student in a course
// @route   POST /api/courses/:id/enroll-student
// @access  Private/Faculty
exports.enrollStudent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Ensure only the instructor or admin can enroll students
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to enroll students in this course' });
    }

    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ message: 'Please provide a student ID' });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.find(
      (s) => s.student.toString() === studentId.toString()
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }

    course.enrolledStudents.push({
      student: studentId,
      progress: { completedLessons: [], percentage: 0 }
    });

    await course.save();
    
    // Optionally return populated enrolledStudents to update UI immediately
    const updatedCourse = await Course.findById(req.params.id).populate('enrolledStudents.student', 'name email avatar');
    res.status(200).json(updatedCourse.enrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
