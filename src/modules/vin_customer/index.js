const express = require('express');
const router = express.Router();
const handler = require('./handler');
const {
  createValidation,
  getByIdValidation,
  getByCustomerValidation,
  updateByCustomerValidation,
  listValidation
} = require('./validation');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');

/**
 * @route   POST /api/epc/vin_customer
 * @desc    Get all vin_customer records with pagination and filters
 * @access  Protected
 */
router.post(
  '/',
  verifyToken,
  listValidation,
  validateMiddleware,
  handler.getAll
);

/**
 * @route   GET /api/epc/vin_customer/:customerId
 * @desc    Get customer by ID with their products
 * @access  Protected
 */
router.get(
  '/:customerId',
  verifyToken,
  getByCustomerValidation,
  validateMiddleware,
  handler.getById
);

/**
 * @route   POST /api/epc/vin_customer/create
 * @desc    Create new vin_customer (single or bulk)
 * @access  Protected
 * @body    { customer_id, product_id } or { customer_id, product_ids: [] }
 */
router.post(
  '/create',
  verifyToken,
  createValidation,
  validateMiddleware,
  handler.create
);

/**
 * @route   PUT /api/epc/vin_customer/:customerId
 * @desc    Update - replace all products for a customer
 * @access  Protected
 * @body    { product_ids: [] }
 */
router.put(
  '/:customerId',
  verifyToken,
  updateByCustomerValidation,
  validateMiddleware,
  handler.update
);

/**
 * @route   DELETE /api/epc/vin_customer/:customerId
 * @desc    Remove - delete all vin_customer records for a customer
 * @access  Protected
 */
router.delete(
  '/:customerId',
  verifyToken,
  getByCustomerValidation,
  validateMiddleware,
  handler.remove
);

/**
 * @route   POST /api/epc/vin_customer/:id/restore
 * @desc    Restore soft deleted vin_customer
 * @access  Protected
 */
router.post(
  '/:id/restore',
  verifyToken,
  getByIdValidation,
  validateMiddleware,
  handler.restore
);

module.exports = router;
