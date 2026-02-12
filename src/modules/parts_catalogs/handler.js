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

module.exports = {
  search,
  searchByVinEndpoint,
  getByTypeCategoryId,
  getByItemCategoryId,
  getVinCategoryByProductId
};

