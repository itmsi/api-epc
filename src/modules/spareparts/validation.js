const { body, param } = require('express-validator');

/**
 * Validation rules for getting spareparts list
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
    .isString()
    .withMessage('Sort by harus berupa string'),
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
];

/**
 * Validation rules for creating sparepart
 */
const createValidation = [
  body('target_id')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Target ID maksimal 255 karakter')
    .trim(),
  body('part_number')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Part number maksimal 255 karakter')
    .trim(),
  body('sparepart_name_en')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Sparepart name EN maksimal 255 karakter')
    .trim(),
  body('sparepart_name_ch')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Sparepart name CH maksimal 255 karakter')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description harus berupa string')
    .trim(),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity harus berupa angka positif'),
  body('unit')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Unit maksimal 255 karakter')
    .trim(),
];

/**
 * Validation rules for updating sparepart
 */
const updateValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
  body('target_id')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Target ID maksimal 255 karakter')
    .trim(),
  body('part_number')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Part number maksimal 255 karakter')
    .trim(),
  body('sparepart_name_en')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Sparepart name EN maksimal 255 karakter')
    .trim(),
  body('sparepart_name_ch')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Sparepart name CH maksimal 255 karakter')
    .trim(),
  body('description')
    .optional()
    .isString()
    .withMessage('Description harus berupa string')
    .trim(),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity harus berupa angka positif'),
  body('unit')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('Unit maksimal 255 karakter')
    .trim(),
];

/**
 * Validation rules for getting sparepart by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules for deleting sparepart
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

