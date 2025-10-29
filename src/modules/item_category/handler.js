const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');
const { uploadToMinio, isMinioEnabled } = require('../../config/minio');
const path = require('path');
const { generateFolder } = require('../../utils/folder');

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
      sort_order = 'desc',
      master_category_name_en,
      dokumen_name
    } = req.body;
    
    // Extract filters from request body
    const filters = {};
    if (master_category_name_en) filters.master_category_name_en = master_category_name_en;
    if (dokumen_name) filters.dokumen_name = dokumen_name;
    
    const data = await repository.findAll(page, limit, search, sort_by, sort_order, filters);
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

    let fileUrl = null;

    // Upload file to MinIO if file exists
    if (req.file && isMinioEnabled) {
      try {
        const bucketName = process.env.S3_BUCKET || 'msi-sso';
        const { pathForDatabase } = generateFolder('item_category');
        const fileName = `${Date.now()}${path.extname(req.file.originalname)}`;
        const objectName = `${pathForDatabase}${fileName}`;
        const contentType = req.file.mimetype;

        // Upload to MinIO (signature: objectName, buffer, contentType, bucketName)
        const uploadResult = await uploadToMinio(objectName, req.file.buffer, contentType, bucketName);

        if (uploadResult.success) {
          // Replace endpoint with S3_BASE_URL if configured
          if (process.env.S3_BASE_URL) {
            fileUrl = uploadResult.url.replace(process.env.S3_ENDPOINT, process.env.S3_BASE_URL);
          } else {
            fileUrl = uploadResult.url;
          }
        } else {
          console.error('Error uploading to MinIO:', uploadResult.error);
        }
      } catch (uploadError) {
        console.error('Error uploading file to MinIO:', uploadError);
      }
    } else if (req.file && !isMinioEnabled) {
      // Fallback to disk storage if MinIO is disabled
      fileUrl = req.file.filename;
    }

    // Prepare data from request body and file upload
    const data = {
      ...req.body,
      item_category_foto: fileUrl
    };

    // Convert empty strings to null for optional fields
    if (data.type_category_id === '') data.type_category_id = null;
    if (data.category_id === '') data.category_id = null;

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

    let fileUrl = req.body.item_category_foto;

    // Upload file to MinIO if new file exists
    if (req.file && isMinioEnabled) {
      try {
        const bucketName = process.env.S3_BUCKET || 'msi-sso';
        const { pathForDatabase } = generateFolder('item_category');
        const fileName = `${Date.now()}${path.extname(req.file.originalname)}`;
        const objectName = `${pathForDatabase}${fileName}`;
        const contentType = req.file.mimetype;

        // Upload to MinIO (signature: objectName, buffer, contentType, bucketName)
        const uploadResult = await uploadToMinio(objectName, req.file.buffer, contentType, bucketName);

        if (uploadResult.success) {
          // Replace endpoint with S3_BASE_URL if configured
          if (process.env.S3_BASE_URL) {
            fileUrl = uploadResult.url.replace(process.env.S3_ENDPOINT, process.env.S3_BASE_URL);
          } else {
            fileUrl = uploadResult.url;
          }
        } else {
          console.error('Error uploading to MinIO:', uploadResult.error);
        }
      } catch (uploadError) {
        console.error('Error uploading file to MinIO:', uploadError);
      }
    } else if (req.file && !isMinioEnabled) {
      // Fallback to disk storage if MinIO is disabled
      fileUrl = req.file.filename;
    }

    // Prepare data from request body and file upload
    const data = {
      ...req.body,
      item_category_foto: fileUrl
    };

    // Convert empty strings to null for optional fields
    if (data.type_category_id === '') data.type_category_id = null;
    if (data.category_id === '') data.category_id = null;

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

/**
 * Get all item categories by dokumen_id with pagination
 */
const getByDokumenId = async (req, res) => {
  try {
    const { dokumen_id } = req.params;
    const { 
      page = 1, 
      limit = 10,
      search = '',
      sort_by = 'created_at', 
      sort_order = 'desc' 
    } = req.query;
    
    const data = await repository.findByDokumenId(dokumen_id, page, limit, search, sort_by, sort_order);
    
    return successResponse(res, data, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

module.exports = {
  getAll,
  getById,
  getByDokumenId,
  create,
  update,
  remove,
  restore
};
