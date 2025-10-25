const { body, param } = require('express-validator');

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
    .isIn(['created_at', 'unit_name_en', 'unit_name_cn'])
    .withMessage('Sort by harus salah satu dari: created_at, unit_name_en, unit_name_cn'),
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
];

/**
 * Validation rules untuk membuat item baru
 */
const createValidation = [
  body('unit_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Unit name EN maksimal 255 karakter')
    .trim(),
  body('unit_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Unit name CN maksimal 255 karakter')
    .trim(),
  body('unit_description')
    .optional()
    .isString()
    .withMessage('Unit description harus berupa string')
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
  body('unit_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Unit name EN maksimal 255 karakter')
    .trim(),
  body('unit_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Unit name CN maksimal 255 karakter')
    .trim(),
  body('unit_description')
    .optional()
    .isString()
    .withMessage('Unit description harus berupa string')
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

