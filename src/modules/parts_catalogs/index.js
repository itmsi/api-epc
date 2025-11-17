const express = require('express');
const router = express.Router();
const handler = require('./handler');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');
const { getValidation, getByTypeCategoryIdValidation, getByItemCategoryIdValidation } = require('./validation');

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

/**
 * @route   GET /api/epc/parts-catalogs/get-by-type-category-id/:type_category_id
 * @desc    Ambil data katalog berdasarkan type_category_id
 * @access  Private
 */
router.get(
  '/get-by-type-category-id/:type_category_id',
  verifyToken,
  getByTypeCategoryIdValidation,
  validateMiddleware,
  handler.getByTypeCategoryId
);

/**
 * @route   GET /api/epc/parts-catalogs/get-by-item-category-id/:item_category_id
 * @desc    Ambil data katalog berdasarkan item_category_id
 * @access  Private
 */
router.get(
  '/get-by-item-category-id/:item_category_id',
  verifyToken,
  getByItemCategoryIdValidation,
  validateMiddleware,
  handler.getByItemCategoryId
);

module.exports = router;

