const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');

/**
 * Get all item categories with pagination and filters
 */
const getAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sort_by = 'created_at', 
      sort_order = 'desc' 
    } = req.body;
    
    const data = await repository.findAll(page, limit, search, sort_by, sort_order);
    return successResponse(res, data, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Get single item category by ID with all related data
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await repository.findById(id);
    
    if (!data) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, data, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Create new item category with details
 */
const create = async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    // Prepare data from request body and file upload
    const data = {
      ...req.body,
      item_category_foto: req.file ? req.file.path : null
    };

    const result = await repository.create(data, userId);
    return successResponse(res, result, 'Data berhasil dibuat', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Update existing item category
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    // Prepare data from request body and file upload
    const data = {
      ...req.body,
      item_category_foto: req.file ? req.file.path : req.body.item_category_foto
    };

    const result = await repository.update(id, data, userId);
    
    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, result, 'Data berhasil diupdate');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Soft delete item category
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    const result = await repository.remove(id, userId);
    
    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, null, 'Data berhasil dihapus');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Restore soft deleted item category
 */
const restore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    const result = await repository.restore(id, userId);
    
    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, result, 'Data berhasil direstore');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore
};
