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

/**
 * Validation untuk pencarian parts catalog by VIN
 */
const getVinValidation = [
  body('vin_number')
    .notEmpty()
    .withMessage('VIN number wajib diisi')
    .bail()
    .isString()
    .withMessage('VIN number harus berupa string')
    .bail()
    .isLength({ max: 255 })
    .withMessage('VIN number maksimal 255 karakter')
    .trim(),
  body('customer_id')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Customer ID harus berupa string')
    .bail()
    .custom((value) => {
      if (value === '' || value === null || value === 'NaN') return true;
      // Basic UUID regex check if needed, or rely on isUUID if strict UUID required
      // Since prompt says "bisa nan, null, string kosong", we allow those.
      // If it's a non-empty string that isn't "NaN", maybe we expect UUID?
      // The prompt implies looser validation "bisa nan". 
      // Let's keep it simple: just allow string. 
      // If specific UUID format is required for valid ID, we can add .isUUID() conditionally.
      // But for now, just string is returned as valid based on prompt.
      return true;
    }),
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
  getByItemCategoryIdValidation,
  getVinValidation
};

