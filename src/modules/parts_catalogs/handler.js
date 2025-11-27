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

module.exports = {
  search,
  getByTypeCategoryId,
  getByItemCategoryId
};

