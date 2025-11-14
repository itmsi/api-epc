const express = require('express');
const router = express.Router();
const handler = require('./handler');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');
const { getValidation } = require('./validation');

/**
 * @route   POST /api/epc/parts-catalogs/get
 * @desc    Cari data katalog berdasarkan VIN number atau part number
 * @access  Private
 */
router.post(
  '/get',
  verifyToken,
  getValidation,
  validateMiddleware,
  handler.search
);

module.exports = router;

