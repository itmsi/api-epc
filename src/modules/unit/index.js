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
 * @route   POST /api/epc/unit/get
 * @desc    Get all units dengan pagination dan filter
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
 * @route   POST /api/epc/unit/create
 * @desc    Create new unit
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
 * @route   GET /api/epc/unit/:id
 * @desc    Get unit by ID
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
 * @route   PUT /api/epc/unit/:id
 * @desc    Update unit
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
 * @route   DELETE /api/epc/unit/:id
 * @desc    Soft delete unit
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

