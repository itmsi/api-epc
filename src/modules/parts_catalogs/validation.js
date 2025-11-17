const { body, param, query } = require('express-validator');

/**
 * Validation untuk pencarian parts catalog
 */
const getValidation = [
  body('data_code')
    .notEmpty()
    .withMessage('Data code wajib diisi')
    .bail()
    .isString()
    .withMessage('Data code harus berupa string')
    .bail()
    .isLength({ max: 255 })
    .withMessage('Data code maksimal 255 karakter')
    .trim(),
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page minimal bernilai 1'),
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1 hingga 100'),
];

/**
 * Validation untuk mengambil data berdasarkan type_category_id
 */
const getByTypeCategoryIdValidation = [
  param('type_category_id')
    .notEmpty()
    .withMessage('Type category ID wajib diisi')
    .bail()
    .isUUID()
    .withMessage('Format type category ID tidak valid'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page minimal bernilai 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1 hingga 100'),
];

/**
 * Validation untuk mengambil data berdasarkan item_category_id
 */
const getByItemCategoryIdValidation = [
  param('item_category_id')
    .notEmpty()
    .withMessage('Item category ID wajib diisi')
    .bail()
    .isUUID()
    .withMessage('Format item category ID tidak valid'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page minimal bernilai 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus antara 1 hingga 100'),
];

module.exports = {
  getValidation,
  getByTypeCategoryIdValidation,
  getByItemCategoryIdValidation
};

