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
  },
  '/parts-catalogs/vin/get': {
    post: {
      tags: ['Parts Catalogs'],
      summary: 'Cari data katalog berdasarkan VIN number dengan validasi customer, pagination, dan sorting',
      description: 'Mencari data produk dan katalog berdasarkan VIN number atau keyword. Mendukung pagination dan sorting by created_at.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PartsCatalogSearchByVinRequest'
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
                $ref: '#/components/schemas/PartsCatalogResponseProduct'
              }
            }
          }
        },
        400: {
          description: 'Permintaan tidak valid'
        },
        401: {
          description: 'Tidak terotorisasi'
        },
        404: {
          description: 'Data tidak ditemukan'
        },
        500: {
          description: 'Terjadi kesalahan pada server'
        }
      }
    }
  },
  '/parts-catalogs/vin/category/{product_id}': {
    get: {
      tags: ['Parts Catalogs'],
      summary: 'Ambil master category berdasarkan product_id',
      description: 'Mengambil data master category yang terkait dengan product_id tertentu.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'product_id',
          in: 'path',
          required: true,
          description: 'ID Product',
          schema: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          }
        }
      ],
      responses: {
        200: {
          description: 'Data berhasil ditemukan',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogResponseMasterCategoryQuery'
              }
            }
          }
        },
        400: {
          description: 'Permintaan tidak valid'
        },
        401: {
          description: 'Tidak terotorisasi'
        },
        404: {
          description: 'Data tidak ditemukan'
        },
        500: {
          description: 'Terjadi kesalahan pada server'
        }
      }
    }
  },
  '/parts-catalogs/get-by-type-category-id/{type_category_id}': {
    get: {
      tags: ['Parts Catalogs'],
      summary: 'Ambil data katalog berdasarkan type_category_id',
      description: 'Mengambil data katalog parts berdasarkan type_category_id dengan join ke item_categories, item_categories_details, dan master_items.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'type_category_id',
          in: 'path',
          required: true,
          description: 'ID dari type category',
          schema: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          }
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Halaman data (opsional, default 1)',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          }
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Jumlah data per halaman (opsional, default 10)',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
            example: 10
          }
        }
      ],
      responses: {
        200: {
          description: 'Data berhasil ditemukan',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogResponseTypeCategoryId'
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
  },
  '/parts-catalogs/get-by-item-category-id/{item_category_id}': {
    get: {
      tags: ['Parts Catalogs'],
      summary: 'Ambil data katalog berdasarkan item_category_id',
      description: 'Mengambil data katalog parts berdasarkan item_category_id dengan join ke item_categories, item_categories_details, dan master_items.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'item_category_id',
          in: 'path',
          required: true,
          description: 'ID dari item category',
          schema: {
            type: 'string',
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000'
          }
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Halaman data (opsional, default 1)',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          }
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Jumlah data per halaman (opsional, default 10)',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
            example: 10
          }
        }
      ],
      responses: {
        200: {
          description: 'Data berhasil ditemukan',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PartsCatalogResponseItemCategoryId'
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

