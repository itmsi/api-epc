const { body, param } = require('express-validator');

/**
 * Validation rules for getting products with pagination
 */
const getValidation = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page harus berupa angka positif'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1-100'),
  body('search')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Search maksimal 255 karakter')
    .trim(),
  body('sort_by')
    .optional()
    .isIn(['created_at', 'updated_at', 'product_name_en', 'product_name_cn', 'vin_number'])
    .withMessage('Sort by harus salah satu dari: created_at, updated_at, product_name_en, product_name_cn, vin_number'),
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
];

/**
 * Validation rules for creating product
 */
const createValidation = [
  body('product_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product name EN maksimal 255 karakter')
    .trim(),
  body('product_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product name CN maksimal 255 karakter')
    .trim(),
  body('product_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Product description maksimal 1000 karakter')
    .trim(),
  body('vin_number')
    .optional()
    .isLength({ max: 255 })
    .withMessage('VIN number maksimal 255 karakter')
    .trim(),
  body('data_details')
    .optional()
    .isArray()
    .withMessage('Data details harus berupa array'),
  body('data_details.*.dokumen_id')
    .optional()
    .isUUID()
    .withMessage('Format dokumen ID tidak valid'),
  body('data_details.*.product_detail_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product detail name EN maksimal 255 karakter')
    .trim(),
  body('data_details.*.product_detail_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product detail name CN maksimal 255 karakter')
    .trim(),
  body('data_details.*.product_detail_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Product detail description maksimal 1000 karakter')
    .trim(),
];

/**
 * Validation rules for updating product
 */
const updateValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
  body('product_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product name EN maksimal 255 karakter')
    .trim(),
  body('product_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product name CN maksimal 255 karakter')
    .trim(),
  body('product_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Product description maksimal 1000 karakter')
    .trim(),
  body('vin_number')
    .optional()
    .isLength({ max: 255 })
    .withMessage('VIN number maksimal 255 karakter')
    .trim(),
  body('data_details')
    .optional()
    .isArray()
    .withMessage('Data details harus berupa array'),
  body('data_details.*.dokumen_id')
    .optional()
    .isUUID()
    .withMessage('Format dokumen ID tidak valid'),
  body('data_details.*.product_detail_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product detail name EN maksimal 255 karakter')
    .trim(),
  body('data_details.*.product_detail_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Product detail name CN maksimal 255 karakter')
    .trim(),
  body('data_details.*.product_detail_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Product detail description maksimal 1000 karakter')
    .trim(),
];

/**
 * Validation rules for getting product by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules for deleting product
 */
const deleteValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

module.exports = {
  getValidation,
  createValidation,
  updateValidation,
  getByIdValidation,
  deleteValidation
};

