const { body, param } = require('express-validator');

/**
 * Validation rules for creating transaction order
 */
const createValidation = [
    body('customer_id')
        .notEmpty()
        .withMessage('Customer ID wajib diisi')
        .isUUID()
        .withMessage('Format Customer ID tidak valid'),
    body('transaction_order_no')
        .optional()
        .isInt()
        .withMessage('Nomor pesanan harus berupa angka bulat'),
    body('transaction_order_date')
        .optional()
        .isISO8601()
        .withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
    body('transaction_order_status')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Status maksimal 255 karakter')
        .trim(),
    body('transaction_order_items')
        .optional()
        .custom((value) => {
            if (typeof value === 'object' || Array.isArray(value)) {
                return true;
            }
            throw new Error('Item pesanan harus berupa JSON yang valid');
        }),
    body('transaction_order_items_total')
        .optional()
        .isInt()
        .withMessage('Total pesanan harus berupa angka bulat'),
    body('transaction_order_description')
        .optional()
        .trim()
];

/**
 * Validation rules for updating transaction order
 */
const updateValidation = [
    param('id')
        .notEmpty()
        .withMessage('ID wajib diisi')
        .isUUID()
        .withMessage('Format ID tidak valid'),
    body('customer_id')
        .optional()
        .isUUID()
        .withMessage('Format Customer ID tidak valid'),
    body('transaction_order_no')
        .optional()
        .isInt()
        .withMessage('Nomor pesanan harus berupa angka bulat'),
    body('transaction_order_date')
        .optional()
        .isISO8601()
        .withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
    body('transaction_order_status')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Status maksimal 255 karakter')
        .trim(),
    body('transaction_order_items')
        .optional()
        .custom((value) => {
            if (typeof value === 'object' || Array.isArray(value)) {
                return true;
            }
            throw new Error('Item pesanan harus berupa JSON yang valid');
        }),
    body('transaction_order_items_total')
        .optional()
        .isInt()
        .withMessage('Total pesanan harus berupa angka bulat'),
    body('transaction_order_description')
        .optional()
        .trim()
];

/**
 * Validation rules for getting item by ID
 */
const getByIdValidation = [
    param('id')
        .notEmpty()
        .withMessage('ID wajib diisi')
        .isUUID()
        .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules for list with pagination parameter coming from req.body
 */
const listValidation = [
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
        .isString(),
    body('sort_order')
        .optional()
        .isIn(['asc', 'desc', 'ASC', 'DESC'])
        .withMessage('Sort order harus asc atau desc')
];

module.exports = {
    createValidation,
    updateValidation,
    getByIdValidation,
    listValidation
};
