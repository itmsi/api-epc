const repository = require('./postgre_repository');
const { successResponse, errorResponse } = require('../../utils/response');

/**
 * Handler pencarian katalog parts berdasarkan VIN number atau part number
 */
const search = async (req, res) => {
  try {
    const {
      data_code: dataCode,
      page = 1,
      limit = 10
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

    const result = await repository.searchPartsCatalog(
      dataCode,
      {
        page: pageNum,
        limit: limitNum
      }
    );

    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Handler pencarian katalog parts berdasarkan VIN number dengan validasi customer
 */
const searchByVinEndpoint = async (req, res) => {
  try {
    const {
      search,
      customer_id: customerId,
      page = 1,
      limit = 10,
      sort_by: sortBy = 'created_at',
      sort_order: sortOrder = 'desc'
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

    const result = await repository.searchByVinWithCustomerCheck(
      search,
      customerId,
      {
        page: pageNum,
        limit: limitNum,
        sortBy,
        sortOrder
      }
    );

    if (!result) {
      // Handle specific error cases if needed, but repository returns null if not found
      // or throws error if validation fails.
      // If simply not found:
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }

    return successResponse(res, result, 'Data berhasil diambil');

  } catch (error) {
    if (error.message === 'Customer tidak memiliki vin number berikut') {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Handler untuk mengambil data parts catalog berdasarkan type_category_id
 */
const getByTypeCategoryId = async (req, res) => {
  try {
    const { type_category_id: typeCategoryId } = req.params;
    const {
      page = 1,
      limit = 10
    } = req.query;

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

    const result = await repository.getByTypeCategoryId(
      typeCategoryId,
      {
        page: pageNum,
        limit: limitNum
      }
    );

    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

/**
 * Handler untuk mengambil data parts catalog berdasarkan item_category_id
 */
const getByItemCategoryId = async (req, res) => {
  try {
    const { item_category_id: itemCategoryId } = req.params;
    const {
      page = 1,
      limit = 10
    } = req.query;

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

    const result = await repository.getByItemCategoryId(
      itemCategoryId,
      {
        page: pageNum,
        limit: limitNum
      }
    );

    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

const getVinCategoryByProductId = async (req, res) => {
  try {
    const { product_id: productId } = req.params;

    const result = await repository.getVinCategoryByProductId(productId);

    if (!result) {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

const getVinCategoryByVinNumber = async (req, res) => {
  try {
    const { vin_number: vinNumber, customer_id: customerId } = req.body;

    const result = await repository.getVinCategoryByVinNumber(vinNumber, customerId);

    if (!result) {
      // Could be not found or validation failed, check repository response logic or handle specific return
      // The repository returns null if product not found or customer verification failed.
      // We can refine this in repo to throw error for specific cases.
      return errorResponse(res, 'Data tidak ditemukan atau akses ditolak', 404);
    }

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    if (error.message === 'Customer tidak memiliki akses ke VIN ini') {
      return errorResponse(res, error.message, 403);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

const getCategoriesByMasterCategoryId = async (req, res) => {
  try {
    const {
      master_category_id: masterCategoryId,
      search,
      product_id: productId,
      customer_id: customerId,
      page = 1,
      limit = 10,
      sort_by: sortBy = 'created_at',
      sort_order: sortOrder = 'desc'
    } = req.body;

    const result = await repository.getCategoriesByMasterCategoryId(masterCategoryId, {
      search,
      page,
      limit,
      sortBy,
      sortOrder,
      productId,
      customerId
    });

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_id: productId } = req.params;
    const data = req.body;
    const userId = req.user ? req.user.user_id : null; // Assuming user_id is in req.user set by verifyToken

    const result = await repository.updateProduct(productId, data, userId);

    return successResponse(res, result, 'Data berhasil diperbarui');
  } catch (error) {
    if (error.message === 'Product not found') {
      return errorResponse(res, 'Product tidak ditemukan', 404);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

const getProductById = async (req, res) => {
  try {
    const { product_id: productId } = req.params;

    const result = await repository.getProductById(productId);

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    if (error.message === 'Product not found') {
      return errorResponse(res, 'Product tidak ditemukan', 404);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

const getItemDetailsByItemCategoryId = async (req, res) => {
  try {
    const { item_category_id: itemCategoryId } = req.params;

    const result = await repository.getItemDetailsByItemCategoryId(itemCategoryId);

    return successResponse(res, result, 'Data berhasil diambil');
  } catch (error) {
    if (error.message === 'Data tidak ditemukan') {
      return errorResponse(res, 'Data tidak ditemukan', 404);
    }
    return errorResponse(res, error.message || 'Terjadi kesalahan', 500);
  }
};

module.exports = {
  search,
  searchByVinEndpoint,
  getByTypeCategoryId,
  getByItemCategoryId,
  getVinCategoryByProductId,
  getVinCategoryByProductId,
  getVinCategoryByVinNumber,
  getCategoriesByMasterCategoryId,
  updateProduct,
  getProductById,
  getItemDetailsByItemCategoryId
};

