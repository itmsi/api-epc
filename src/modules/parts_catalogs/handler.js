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

    const result = await repository.searchPartsCatalog(
      dataCode,
      {
        page: Number(page) || 1,
        limit: Number(limit) || 10
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
  search
};

