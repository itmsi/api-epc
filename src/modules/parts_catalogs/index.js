const express = require('express');
const router = express.Router();
const handler = require('./handler');
const { verifyToken } = require('../../middlewares');
const { validateMiddleware } = require('../../middlewares/validation');
const { getValidation, getByTypeCategoryIdValidation, getByItemCategoryIdValidation, getVinValidation, getVinCategoryByProductIdValidation, getVinCategoryByVinNumberValidation } = require('./validation');

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
 * @route   POST /api/epc/parts-catalogs/vin/get
 * @desc    Cari data katalog berdasarkan VIN number dengan validasi customer
 * @access  Private
 */
router.post(
  '/vin/get',
  verifyToken,
  getVinValidation,
  validateMiddleware,
  handler.searchByVinEndpoint
);

/**
 * @route   GET /api/epc/parts-catalogs/vin/category/:product_id
 * @desc    Ambil master category berdasarkan product_id
 * @access  Private
 */
router.get(
  '/vin/category/:product_id',
  verifyToken,
  getVinCategoryByProductIdValidation,
  validateMiddleware,
  handler.getVinCategoryByProductId
);

/**
 * @route   POST /api/epc/parts-catalogs/vin/category-by-vin
 * @desc    Ambil master category berdasarkan vin_number dan customer_id
 * @access  Private
 */
router.post(
  '/vin/category-by-vin',
  verifyToken,
  getVinCategoryByVinNumberValidation,
  validateMiddleware,
  handler.getVinCategoryByVinNumber
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

