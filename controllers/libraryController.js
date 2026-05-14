const LibraryResource = require('../models/LibraryResource');

// @desc    Get all library resources
// @route   GET /api/library
// @access  Private
exports.getResources = async (req, res) => {
  try {
    let query = {};
    
    // Search by title or tags
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    const resources = await LibraryResource.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new resource
// @route   POST /api/library
// @access  Private/Faculty or Admin
exports.addResource = async (req, res) => {
  try {
    const resource = new LibraryResource({
      ...req.body,
      uploadedBy: req.user._id
    });
    
    const createdResource = await resource.save();
    res.status(201).json(createdResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment download count
// @route   PUT /api/library/:id/download
// @access  Private
exports.trackDownload = async (req, res) => {
  try {
    const resource = await LibraryResource.findById(req.params.id);
    if (resource) {
      resource.downloads += 1;
      await resource.save();
      res.json({ message: 'Download tracked' });
    } else {
      res.status(404).json({ message: 'Resource not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
