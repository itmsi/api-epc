const express = require('express');
const router = express.Router();
const handler = require('./handler');
const {
  getValidation,
  createValidation,
  updateValidation,
  getByIdValidation,
  deleteValidation
} = require('./validation');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileUpload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * Middleware to parse data_items from string to array
 */
const parseDataItems = (req, res, next) => {
  // Check if data_items exists and is a string
  if (req.body.data_items) {
    if (typeof req.body.data_items === 'string') {
      try {
        req.body.data_items = JSON.parse(req.body.data_items);
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: ['Format data_items tidak valid (bukan JSON yang valid)'],
          exception: error.message || 'Format data_items tidak valid',
          data: []
        });
      }
    }
    // If it's already an array, keep it as is
  }
  next();
};

/**
 * @route   POST /api/epc/item_category/get
 * @desc    Get all item categories with pagination and filters
 * @access  Private
 */
router.post(
  '/get',
  verifyToken,
  getValidation,
  validateMiddleware,
  handler.getAll
);

/**
 * @route   GET /api/epc/item_category/:id
 * @desc    Get item category by ID with all related data
 * @access  Private
 */
router.get(
  '/:id',
  verifyToken,
  getByIdValidation,
  validateMiddleware,
  handler.getById
);

/**
 * @route   POST /api/epc/item_category/create
 * @desc    Create new item category with details
 * @access  Private
 */
router.post(
  '/create',
  verifyToken,
  fileUpload.single('file_foto'),
  parseDataItems,
  createValidation,
  validateMiddleware,
  handler.create
);

/**
 * @route   PUT /api/epc/item_category/:id
 * @desc    Update item category
 * @access  Private
 */
router.put(
  '/:id',
  verifyToken,
  fileUpload.single('file_foto'),
  parseDataItems,
  updateValidation,
  validateMiddleware,
  handler.update
);

/**
 * @route   DELETE /api/epc/item_category/:id
 * @desc    Soft delete item category
 * @access  Private
 */
router.delete(
  '/:id',
  verifyToken,
  deleteValidation,
  validateMiddleware,
  handler.remove
);

/**
 * @route   POST /api/epc/item_category/:id/restore
 * @desc    Restore soft deleted item category
 * @access  Private
 */
router.post(
  '/:id/restore',
  verifyToken,
  getByIdValidation,
  validateMiddleware,
  handler.restore
);

module.exports = router;
