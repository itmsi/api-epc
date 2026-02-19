const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');

/**
 * Get all vin_customer records with pagination and filters
 * Returns customers grouped with their products
 */
const getAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search = '',
      sort_by = 'created_at',
      sort_order = 'desc',
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
    
    const groupedRepo = require('./grouped_repository');
    const data = await groupedRepo.findAllGrouped(pageNum, limitNum, search, sort_by, sort_order);
    return successResponse(res, data, 'Data berhasil diambil', 200);
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Get customer by ID with their products (grouped format)
 */
const getById = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const groupedRepo = require('./grouped_repository');
    const data = await groupedRepo.findCustomerByIdGrouped(customerId);
    
    if (!data) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    
    return successResponse(res, data, 'Data berhasil diambil', 200);
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};


/**
 * Create vin_customer record(s)
 * Supports single product or bulk products insert
 */
const create = async (req, res) => {
  try {
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    const { customer_id, product_id, product_ids } = req.body;
    
    // Validate customer_id is present
    if (!customer_id) {
      return errorResponse(res, 'customer_id wajib diisi', 400);
    }
    
    let result;
    
    // Check if bulk insert (array of product_ids) or single insert
    if (product_ids && Array.isArray(product_ids) && product_ids.length > 0) {
      // Bulk insert
      result = await repository.bulkCreate(customer_id, product_ids, userId);
      return successResponse(res, result, `Berhasil menambahkan ${result.length} product untuk customer`, 201);
    } else if (product_id) {
      // Single insert
      result = await repository.create({ customer_id, product_id }, userId);
      return successResponse(res, result, 'Berhasil menambahkan product untuk customer', 201);
    } else {
      return errorResponse(res, 'product_id atau product_ids wajib diisi', 400);
    }
  } catch (error) {
    // Handle unique constraint violation
    if (error.code === '23505') {
      return errorResponse(res, 'Customer sudah memiliki product ini', 409);
    }
    // Handle foreign key violation
    if (error.code === '23503') {
      return errorResponse(res, 'Product ID tidak valid atau tidak ditemukan', 400);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Update - replace all products for a customer
 */
const update = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { customer_id: newCustomerId, product_ids } = req.body;
    
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }
    
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return errorResponse(res, 'product_ids harus berupa array dan tidak boleh kosong', 400);
    }

    const results = await repository.update(customerId, product_ids, userId, newCustomerId);
    
    const message = newCustomerId 
      ? `Berhasil memindahkan ${results.length} product ke customer baru`
      : `Berhasil mengupdate ${results.length} product untuk customer`;
    
    return successResponse(
      res, 
      results,
      message,
      200
    );
  } catch (error) {
    // Handle foreign key violation
    if (error.code === '23503') {
      return errorResponse(res, 'Salah satu Product ID tidak valid atau tidak ditemukan', 400);
    }
    // Handle unique constraint violation (customer already has product)
    if (error.code === '23505') {
      return errorResponse(res, 'Customer tujuan sudah memiliki salah satu product ini', 409);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Remove - delete all vin_customer records for a customer
 */
const remove = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // Get user ID from token
    const userId = req.user?.employee_id || req.user?.user_id;
    
    if (!userId) {
      return errorResponse(res, 'User ID tidak ditemukan dalam token', 401);
    }

    const results = await repository.remove(customerId, userId);
    
    if (!results || results.length === 0) {
      return errorResponse(res, 'Data tidak ditemukan atau sudah dihapus', 404);
    }
    
    return successResponse(
      res,
      null,
      `Berhasil menghapus ${results.length} product untuk customer`,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Restore soft deleted vin_customer record
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
      return errorResponse(res, 'Data tidak ditemukan atau belum dihapus', 404);
    }
    
    return successResponse(res, result, 'Data berhasil direstore', 200);
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
