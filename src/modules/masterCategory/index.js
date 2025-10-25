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

/**
 * @route   POST /api/epc/master_category/get
 * @desc    Get all master categories dengan pagination dan filter
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
 * @route   GET /api/epc/master_category/:id
 * @desc    Get master category by ID
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
 * @route   POST /api/epc/master_category/create
 * @desc    Create new master category
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
 * @route   PUT /api/epc/master_category/:id
 * @desc    Update master category
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
 * @route   DELETE /api/epc/master_category/:id
 * @desc    Soft delete master category
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
 * @route   POST /api/epc/master_category/:id/restore
 * @desc    Restore soft deleted master category
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
