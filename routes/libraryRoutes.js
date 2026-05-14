const express = require('express');
const router = express.Router();
const { getResources, addResource, trackDownload } = require('../controllers/libraryController');
const { protect, faculty } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getResources)
  .post(protect, faculty, addResource);

router.route('/:id/download')
  .put(protect, trackDownload);

module.exports = router;
