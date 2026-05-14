const express = require('express');
const router = express.Router();
const { getUsers, getStudents, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin, faculty } = require('../middleware/authMiddleware');

// Faculty route to get all students
router.route('/students')
  .get(protect, faculty, getStudents);

// All routes here are protected and require admin role
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
