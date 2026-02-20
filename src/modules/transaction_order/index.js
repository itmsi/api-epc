const express = require('express');
const router = express.Router();
const handler = require('./handler');
const {
    createValidation,
    updateValidation,
    getByIdValidation,
    listValidation
} = require('./validation');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');

/**
 * @route   POST /api/epc/transaction_order/get
 * @desc    Get all transaction orders with pagination
 * @access  Private
 */
router.post(
    '/get',
    verifyToken,
    listValidation,
    validateMiddleware,
    handler.getAll
);

/**
 * @route   GET /api/epc/transaction_order/:id
 * @desc    Get transaction order by ID
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
 * @route   POST /api/epc/transaction_order/create
 * @desc    Create new transaction order
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
 * @route   PUT /api/epc/transaction_order/:id
 * @desc    Update transaction order
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
 * @route   DELETE /api/epc/transaction_order/:id
 * @desc    Soft delete transaction order
 * @access  Private
 */
router.delete(
    '/:id',
    verifyToken,
    getByIdValidation,
    validateMiddleware,
    handler.remove
);

module.exports = router;
