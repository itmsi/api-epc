const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');

/**
 * Get all items dengan pagination dan filter
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
 * Get single item by ID
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
 * Create new item
 */
const create = async (req, res) => {
  try {
    // Ambil user ID dari token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 400);
    }
    
    const data = await repository.create(req.body, userId);
    return successResponse(res, data, 'Category berhasil dibuat', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Update existing item
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil user ID dari token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 400);
    }
    
    const data = await repository.update(id, req.body, userId);
    
    if (!data) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, data, 'Category berhasil diupdate');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Soft delete item
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil user ID dari token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 400);
    }
    
    const result = await repository.remove(id, userId);
    
    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, null, 'Category berhasil dihapus');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Restore soft deleted item
 */
const restore = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil user ID dari token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 400);
    }
    
    const data = await repository.restore(id, userId);
    
    if (!data) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, data, 'Category berhasil direstore');
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

