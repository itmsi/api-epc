const { body, param, query } = require('express-validator');

/**
 * Validation rules for creating vin_customer
 * Supports both single product and bulk products
 */
const createValidation = [
  body('customer_id')
    .notEmpty()
    .withMessage('customer_id wajib diisi')
    .isUUID()
    .withMessage('customer_id harus berupa UUID yang valid'),
  
  // Either product_id (single) or product_ids (array) must be present
  body('product_id')
    .optional()
    .isUUID()
    .withMessage('product_id harus berupa UUID yang valid'),
  
  body('product_ids')
    .optional()
    .isArray({ min: 1 })
    .withMessage('product_ids harus berupa array dengan minimal 1 item'),
  
  body('product_ids.*')
    .optional()
    .isUUID()
    .withMessage('Setiap product_id dalam array harus berupa UUID yang valid'),
  
  // Custom validation: at least one of product_id or product_ids must exist
  body()
    .custom((value, { req }) => {
      if (!req.body.product_id && (!req.body.product_ids || req.body.product_ids.length === 0)) {
        throw new Error('product_id atau product_ids wajib diisi');
      }
      return true;
    })
];

/**
 * Validation rules for updating vin_customer
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
    .withMessage('customer_id harus berupa UUID yang valid'),
  
  body('product_id')
    .optional()
    .isUUID()
    .withMessage('product_id harus berupa UUID yang valid')
];

/**
 * Validation rules for getting vin_customer by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid')
];

/**
 * Validation rules for getting by customer ID
 */
const getByCustomerValidation = [
  param('customerId')
    .notEmpty()
    .withMessage('Customer ID wajib diisi')
    .isUUID()
    .withMessage('Format Customer ID tidak valid')
];

/**
 * Validation rules for list with pagination
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
    .isIn(['created_at', 'updated_at', 'product_name_en', 'vin_number', 'customer_name'])
    .withMessage('Sort by harus salah satu dari: created_at, updated_at, product_name_en, vin_number, customer_name'),
  
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
  
  body('customer_id')
    .optional()
    .isUUID()
    .withMessage('customer_id harus berupa UUID yang valid'),
  
  body('product_id')
    .optional()
    .isUUID()
    .withMessage('product_id harus berupa UUID yang valid')
];

/**
 * Validation rules for updating products by customer ID
 */
const updateByCustomerValidation = [
  param('customerId')
    .notEmpty()
    .withMessage('Customer ID wajib diisi')
    .isUUID()
    .withMessage('Format Customer ID tidak valid'),
  
  body('product_ids')
    .notEmpty()
    .withMessage('product_ids wajib diisi')
    .isArray()
    .withMessage('product_ids harus berupa array')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('product_ids tidak boleh kosong');
      }
      return true;
    })
    .custom((value) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const invalidIds = value.filter(id => !uuidRegex.test(id));
      if (invalidIds.length > 0) {
        throw new Error(`product_ids mengandung UUID yang tidak valid: ${invalidIds.join(', ')}`);
      }
      return true;
    })
];

module.exports = {
  createValidation,
  updateValidation,
  getByIdValidation,
  getByCustomerValidation,
  updateByCustomerValidation,
  listValidation
};
