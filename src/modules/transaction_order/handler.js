const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');

const getUserId = (req) => {
    if (req.user) {
        return req.user.employee_id || req.user.user_id || req.user.id || null;
    }
    return null;
};

/**
 * Get all transaction orders with pagination
 */
const getAll = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            sort_by: sortBy = 'created_at',
            sort_order: sortOrder = 'desc'
        } = req.body;

        const options = {
            page: parseInt(page, 10) || 1,
            limit: parseInt(limit, 10) || 10,
            search,
            sortBy,
            sortOrder
        };

        const data = await repository.findAll(options);
        return successResponse(res, data, 'Data berhasil diambil');
    } catch (error) {
        return errorResponse(res, error.message || 'Terjadi kesalahan sistem', 500);
    }
};

/**
 * Get single transaction order by ID
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
        return errorResponse(res, error.message || 'Terjadi kesalahan sistem', 500);
    }
};

/**
 * Create new transaction order
 */
const create = async (req, res) => {
    try {
        const userId = getUserId(req);
        const data = await repository.create(req.body, userId);
        return successResponse(res, data, 'Data berhasil dibuat', 201);
    } catch (error) {
        return errorResponse(res, error.message || 'Terjadi kesalahan sistem', 500);
    }
};

/**
 * Update existing transaction order
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if exists
        const existing = await repository.findById(id);
        if (!existing) {
            return errorResponse(res, 'Data tidak ditemukan', 404);
        }

        const userId = getUserId(req);
        const data = await repository.update(id, req.body, userId);

        return successResponse(res, data, 'Data berhasil diupdate');
    } catch (error) {
        return errorResponse(res, error.message || 'Terjadi kesalahan sistem', 500);
    }
};

/**
 * Soft delete transaction order
 */
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if exists
        const existing = await repository.findById(id);
        if (!existing) {
            return errorResponse(res, 'Data tidak ditemukan', 404);
        }

        const userId = getUserId(req);
        const result = await repository.remove(id, userId);

        return successResponse(res, null, 'Data berhasil dihapus');
    } catch (error) {
        return errorResponse(res, error.message || 'Terjadi kesalahan sistem', 500);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
