const express = require('express');
const router = express.Router();
const handler = require('./handler');
const {
  getValidation,
  createValidation,
  updateValidation,
  getByIdValidation,
  deleteValidation,
  duplicateValidation
} = require('./validation');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');

/**
 * @route   POST /api/epc/dokumen/get
 * @desc    Get all documents with pagination and filters
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
 * @route   POST /api/epc/dokumen/duplikat/:dokumen_id
 * @desc    Duplicate document with all related data
 * @access  Private
 */
router.post(
  '/duplikat/:dokumen_id',
  verifyToken,
  duplicateValidation,
  validateMiddleware,
  handler.duplicate
);

/**
 * @route   GET /api/epc/dokumen/:id
 * @desc    Get document by ID
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
 * @route   POST /api/epc/dokumen/create
 * @desc    Create new document
 * @access  Private
 */
router.post(
  '/create',
  verifyToken,
  createValidation,
  validateMiddleware,
  handler.create
);

/**
 * @route   PUT /api/epc/dokumen/:id
 * @desc    Update document
 * @access  Private
 */
router.put(
  '/:id',
  verifyToken,
  updateValidation,
  validateMiddleware,
  handler.update
);

/**
 * @route   DELETE /api/epc/dokumen/:id
 * @desc    Soft delete document
 * @access  Private
 */
router.delete(
  '/:id',
  verifyToken,
  deleteValidation,
  validateMiddleware,
  handler.remove
);

module.exports = router;

