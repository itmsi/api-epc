const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { baseResponse } = require('../../utils/exception');

/**
 * Get all products with pagination and filters
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
    
    // Convert page and limit to integers and validate
    let pageNum = parseInt(page, 10) || 1;
    let limitNum = parseInt(limit, 10) || 10;
    
    // Ensure limit doesn't exceed maximum (100)
    if (limitNum > 100) {
      limitNum = 100;
    }
    if (limitNum < 1) {
      limitNum = 10;
    }
    if (pageNum < 1) {
      pageNum = 1;
    }
    
    const data = await repository.findAll(pageNum, limitNum, search, sort_by, sort_order);
    return successResponse(res, data, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Get single product by ID with all related data
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
 * Create new product with details
 */
const create = async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    // Validasi duplikat vin_number
    if (req.body.vin_number) {
      const existingProduct = await repository.findByVinNumber(req.body.vin_number);
      if (existingProduct) {
        return errorResponse(res, 'VIN number sudah ada', 409);
      }
    }

    const result = await repository.create(req.body, userId);
    return successResponse(res, result, 'Data berhasil dibuat', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Update existing product
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    // Validasi duplikat vin_number (exclude current ID)
    if (req.body.vin_number) {
      const existingProduct = await repository.findByVinNumber(req.body.vin_number, id);
      if (existingProduct) {
        return errorResponse(res, 'VIN number sudah ada', 409);
      }
    }

    const result = await repository.update(id, req.body, userId);
    
    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, result, 'Data berhasil diupdate');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Soft delete product
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
 * Restore soft deleted product
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

