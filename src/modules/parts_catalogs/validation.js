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
    body('search')
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage('Search harus berupa string')
        .bail()
        .isLength({ max: 255 })
        .withMessage('Search maksimal 255 karakter')
        .trim(),
    body('customer_id')
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage('Customer ID harus berupa string')
        .bail()
        .custom((value) => {
            if (value === '' || value === null || value === 'NaN') return true;
            return true;
        }),
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page minimal bernilai 1'),
    body('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit harus antara 1 hingga 100'),
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
 * Validation untuk mengambil data category berdasarkan product_id
 */
const getVinCategoryByProductIdValidation = [
    param('product_id')
        .notEmpty()
        .withMessage('Product ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format product ID tidak valid'),
];

module.exports = {
    getValidation,
    getByTypeCategoryIdValidation,
    getByItemCategoryIdValidation,
    getVinValidation,
    getVinCategoryByProductIdValidation
};
