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
        .isInt({ min: 1, max: 9999 })
        .withMessage('Limit harus antara 1 hingga 9999'),
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
        .isInt({ min: 1, max: 9999 })
        .withMessage('Limit harus antara 1 hingga 9999'),
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
        .isInt({ min: 1, max: 9999 })
        .withMessage('Limit harus antara 1 hingga 9999'),
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
        .isInt({ min: 1, max: 9999 })
        .withMessage('Limit harus antara 1 hingga 9999'),
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

/**
 * Validation untuk mengambil data category berdasarkan vin_number (POST)
 */
const getVinCategoryByVinNumberValidation = [
    body('vin_number')
        .notEmpty()
        .withMessage('VIN Number wajib diisi')
        .bail()
        .isString()
        .withMessage('VIN Number harus berupa string')
        .bail()
        .isLength({ max: 255 })
        .withMessage('VIN Number maksimal 255 karakter')
        .trim(),
    body('customer_id')
        .notEmpty()
        .withMessage('Customer ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format Customer ID tidak valid'),
];

/**
 * Validation untuk mengambil data categories berdasarkan master_category_id (POST)
 */
const getCategoriesByMasterCategoryIdValidation = [
    body('master_category_id')
        .optional({ nullable: true })
        .isUUID()
        .withMessage('Format Master Category ID tidak valid'),
    body('dokumen_ids')
        .optional()
        .isArray()
        .withMessage('Dokumen IDs harus berupa array'),
    body('dokumen_ids.*')
        .optional()
        .isUUID()
        .withMessage('Format Dokumen ID dalam array tidak valid'),
    body('search')
        .optional({ nullable: true, checkFalsy: true })
        .isString()
        .withMessage('Search harus berupa string')
        .bail()
        .isLength({ max: 255 })
        .withMessage('Search maksimal 255 karakter')
        .trim(),
    body('product_id')
        .notEmpty()
        .withMessage('Product ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format Product ID tidak valid'),
    body('customer_id')
        .notEmpty()
        .withMessage('Customer ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format Customer ID tidak valid'),
    body('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page minimal bernilai 1'),
    body('limit')
        .optional()
        .isInt({ min: 1, max: 9999 })
        .withMessage('Limit harus antara 1 hingga 9999'),
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
 * Validation untuk update data product
 */
const updateProductValidation = [
    param('product_id')
        .notEmpty()
        .withMessage('Product ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format Product ID tidak valid'),
    body('product_name_en')
        .optional({ nullable: true })
        .isString()
        .withMessage('Product Name EN harus berupa string')
        .isLength({ max: 255 })
        .withMessage('Product Name EN maksimal 255 karakter'),
    body('product_name_cn')
        .optional({ nullable: true })
        .isString()
        .withMessage('Product Name CN harus berupa string')
        .isLength({ max: 255 })
        .withMessage('Product Name CN maksimal 255 karakter'),
    body('product_description')
        .optional({ nullable: true })
        .isString()
        .withMessage('Product Description harus berupa string'),
    body('vin_number')
        .optional({ nullable: true })
        .isString()
        .withMessage('VIN Number harus berupa string')
        .isLength({ max: 255 })
        .withMessage('VIN Number maksimal 255 karakter'),
    body('model_type')
        .optional({ nullable: true })
        .isString()
        .withMessage('Model Type harus berupa string')
        .isLength({ max: 255 })
        .withMessage('Model Type maksimal 255 karakter'),
    body('dimensi')
        .optional({ nullable: true })
        .isString()
        .withMessage('Dimensi harus berupa string')
        .isLength({ max: 255 })
        .withMessage('Dimensi maksimal 255 karakter'),
    body('model_engine')
        .optional({ nullable: true })
        .isString()
        .withMessage('Model Engine harus berupa string')
        .isLength({ max: 255 })
        .withMessage('Model Engine maksimal 255 karakter'),
    body('body_number')
        .optional({ nullable: true })
        .isString()
        .withMessage('Body Number harus berupa string')
        .isLength({ max: 255 })
        .withMessage('Body Number maksimal 255 karakter')
];

/**
 * Validation untuk mengambil data product by ID
 */
const getProductByIdValidation = [
    param('product_id')
        .notEmpty()
        .withMessage('Product ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format Product ID tidak valid'),
];

/**
 * Validation untuk mengambil detail items berdasarkan item_category_id
 */
const getItemDetailsByItemCategoryIdValidation = [
    param('item_category_id')
        .notEmpty()
        .withMessage('Item Category ID wajib diisi')
        .bail()
        .isUUID()
        .withMessage('Format Item Category ID tidak valid'),
];

module.exports = {
    getValidation,
    getByTypeCategoryIdValidation,
    getByItemCategoryIdValidation,
    getVinValidation,
    getVinCategoryByProductIdValidation,
    getVinCategoryByVinNumberValidation,
    getCategoriesByMasterCategoryIdValidation,
    updateProductValidation,
    getProductByIdValidation,
    getItemDetailsByItemCategoryIdValidation
};
