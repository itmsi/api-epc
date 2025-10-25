const { body, param, query } = require('express-validator');

/**
 * Validation rules untuk mendapatkan data dengan filter
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
    .isString()
    .withMessage('Search harus berupa string'),
  body('sort_by')
    .optional()
    .isIn(['created_at', 'master_category_name_en', 'category_name_cn'])
    .withMessage('Sort by harus salah satu dari: created_at, master_category_name_en, category_name_cn'),
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
];

/**
 * Validation rules untuk membuat item baru
 */
const createValidation = [
  body('master_category_id')
    .optional()
    .isUUID()
    .withMessage('Master category ID harus berupa UUID yang valid')
    .trim(),
  body('master_category_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Master category name EN maksimal 255 karakter')
    .trim(),
  body('category_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Category name CN maksimal 255 karakter')
    .trim(),
  body('category_description')
    .optional()
    .isString()
    .withMessage('Category description harus berupa string')
    .trim(),
  body('data_type')
    .optional()
    .isArray()
    .withMessage('Data type harus berupa array'),
  body('data_type.*.type_category_id')
    .optional()
    .isUUID()
    .withMessage('Type category ID harus berupa UUID yang valid'),
  body('data_type.*.type_category_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Type category name EN maksimal 255 karakter')
    .trim(),
  body('data_type.*.type_category_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Type category name CN maksimal 255 karakter')
    .trim(),
  body('data_type.*.type_category_description')
    .optional()
    .isString()
    .withMessage('Type category description harus berupa string')
    .trim(),
];

/**
 * Validation rules untuk update item
 */
const updateValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
  body('master_category_id')
    .optional()
    .isUUID()
    .withMessage('Master category ID harus berupa UUID yang valid')
    .trim(),
  body('master_category_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Master category name EN maksimal 255 karakter')
    .trim(),
  body('category_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Category name CN maksimal 255 karakter')
    .trim(),
  body('category_description')
    .optional()
    .isString()
    .withMessage('Category description harus berupa string')
    .trim(),
  body('data_type')
    .optional()
    .isArray()
    .withMessage('Data type harus berupa array'),
  body('data_type.*.type_category_id')
    .optional()
    .isUUID()
    .withMessage('Type category ID harus berupa UUID yang valid'),
  body('data_type.*.type_category_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Type category name EN maksimal 255 karakter')
    .trim(),
  body('data_type.*.type_category_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Type category name CN maksimal 255 karakter')
    .trim(),
  body('data_type.*.type_category_description')
    .optional()
    .isString()
    .withMessage('Type category description harus berupa string')
    .trim(),
];

/**
 * Validation rules untuk mendapatkan item by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules untuk delete item
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

