/**
 * Swagger Path Definitions for Parts Catalogs Search Module
 */

const partsCatalogPaths = {
  '/parts-catalogs/get': {
    post: {
      tags: ['Parts Catalogs'],
      summary: 'Cari data katalog parts',
      description: 'Mencari data berdasarkan VIN number atau part number dengan prioritas pencarian berlapis.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PartsCatalogSearchRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Data berhasil ditemukan',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  { $ref: '#/components/schemas/PartsCatalogResponseVin' },
                  { $ref: '#/components/schemas/PartsCatalogResponseCategory' },
                  { $ref: '#/components/schemas/PartsCatalogResponseType' },
                  { $ref: '#/components/schemas/PartsCatalogResponseItem' }
                ]
              }
            }
          }
        },
        400: {
          description: 'Permintaan tidak valid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Tidak terotorisasi',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogErrorResponse'
              }
            }
          }
        },
        404: {
          description: 'Data tidak ditemukan',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Terjadi kesalahan pada server',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogErrorResponse'
              }
            }
          }
        }
      }
    }
  }
};

module.exports = partsCatalogPaths;

