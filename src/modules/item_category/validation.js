const { body, param, query } = require('express-validator');

/**
 * Validation rules for getting item categories with pagination
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
    .isIn(['created_at', 'updated_at', 'item_category_name_en', 'item_category_name_cn'])
    .withMessage('Sort by harus salah satu dari: created_at, updated_at, item_category_name_en, item_category_name_cn'),
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
];

/**
 * Validation rules for creating item category
 */
const createValidation = [
  body('dokumen_name')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Dokumen name maksimal 255 karakter')
    .trim(),
  body('master_category_id')
    .notEmpty()
    .withMessage('Master category ID wajib diisi')
    .isUUID()
    .withMessage('Format Master category ID tidak valid'),
  body('category_id')
    .notEmpty()
    .withMessage('Category ID wajib diisi')
    .isUUID()
    .withMessage('Format Category ID tidak valid'),
  body('type_category_id')
    .notEmpty()
    .withMessage('Type category ID wajib diisi')
    .isUUID()
    .withMessage('Format Type category ID tidak valid'),
  body('item_category_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Item category name EN maksimal 255 karakter')
    .trim(),
  body('item_category_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Item category name CN maksimal 255 karakter')
    .trim(),
  body('item_category_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Item category description maksimal 1000 karakter')
    .trim(),
  body('data_items')
    .optional()
    .isArray()
    .withMessage('Data items harus berupa array'),
  body('data_items.*.target_id')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Target ID maksimal 255 karakter')
    .trim(),
  body('data_items.*.part_number')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Part number maksimal 255 karakter')
    .trim(),
  body('data_items.*.catalog_item_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Catalog item name EN maksimal 255 karakter')
    .trim(),
  body('data_items.*.catalog_item_name_ch')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Catalog item name CH maksimal 255 karakter')
    .trim(),
  body('data_items.*.description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description maksimal 1000 karakter')
    .trim(),
  body('data_items.*.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity harus berupa angka positif'),
  body('data_items.*.unit')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Unit maksimal 255 karakter')
    .trim(),
];

/**
 * Validation rules for updating item category
 */
const updateValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
  body('dokumen_name')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Dokumen name maksimal 255 karakter')
    .trim(),
  body('master_category_id')
    .optional()
    .isUUID()
    .withMessage('Format Master category ID tidak valid'),
  body('category_id')
    .optional()
    .isUUID()
    .withMessage('Format Category ID tidak valid'),
  body('type_category_id')
    .optional()
    .isUUID()
    .withMessage('Format Type category ID tidak valid'),
  body('item_category_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Item category name EN maksimal 255 karakter')
    .trim(),
  body('item_category_name_cn')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Item category name CN maksimal 255 karakter')
    .trim(),
  body('item_category_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Item category description maksimal 1000 karakter')
    .trim(),
  body('data_items')
    .optional()
    .isArray()
    .withMessage('Data items harus berupa array'),
  body('data_items.*.target_id')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Target ID maksimal 255 karakter')
    .trim(),
  body('data_items.*.part_number')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Part number maksimal 255 karakter')
    .trim(),
  body('data_items.*.catalog_item_name_en')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Catalog item name EN maksimal 255 karakter')
    .trim(),
  body('data_items.*.catalog_item_name_ch')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Catalog item name CH maksimal 255 karakter')
    .trim(),
  body('data_items.*.description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description maksimal 1000 karakter')
    .trim(),
  body('data_items.*.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity harus berupa angka positif'),
  body('data_items.*.unit')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Unit maksimal 255 karakter')
    .trim(),
];

/**
 * Validation rules for getting item category by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules for deleting item category
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
