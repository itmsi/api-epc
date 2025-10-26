const { body, param } = require('express-validator');

/**
 * Validation rules for getting documents with pagination
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
    .isIn(['created_at', 'updated_at', 'dokumen_name'])
    .withMessage('Sort by harus salah satu dari: created_at, updated_at, dokumen_name'),
  body('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order harus asc atau desc'),
];

/**
 * Validation rules for creating document
 */
const createValidation = [
  body('dokumen_name')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Dokumen name maksimal 255 karakter')
    .trim(),
  body('dokumen_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Dokumen description maksimal 1000 karakter')
    .trim(),
];

/**
 * Validation rules for updating document
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
  body('dokumen_description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Dokumen description maksimal 1000 karakter')
    .trim(),
];

/**
 * Validation rules for getting document by ID
 */
const getByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID wajib diisi')
    .isUUID()
    .withMessage('Format ID tidak valid'),
];

/**
 * Validation rules for deleting document
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

