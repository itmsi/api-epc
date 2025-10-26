/**
 * Swagger Schema Definitions for Products Module
 */

const productsSchemas = {
  ProductDetail: {
    type: 'object',
    properties: {
      product_detail_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for product detail',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Reference to product',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      dokumen_id: {
        type: 'string',
        format: 'uuid',
        description: 'Reference to document',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      product_detail_name_en: {
        type: 'string',
        description: 'Product detail name in English',
        example: 'Engine Assembly'
      },
      product_detail_name_cn: {
        type: 'string',
        description: 'Product detail name in Chinese',
        example: '发动机总成'
      },
      product_detail_description: {
        type: 'string',
        description: 'Product detail description',
        example: 'Complete engine assembly with all components'
      },
      dokumen_name: {
        type: 'string',
        description: 'Document name',
        example: 'Engine Manual'
      },
      dokumen_description: {
        type: 'string',
        description: 'Document description',
        example: 'Engine assembly manual'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2025-01-01T00:00:00.000Z'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  Product: {
    type: 'object',
    properties: {
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      product_name_en: {
        type: 'string',
        description: 'Product name in English',
        example: 'BMW X5 2020'
      },
      product_name_cn: {
        type: 'string',
        description: 'Product name in Chinese',
        example: '宝马X5 2020'
      },
      product_description: {
        type: 'string',
        description: 'Product description',
        example: 'Complete vehicle with all parts'
      },
      vin_number: {
        type: 'string',
        description: 'Vehicle identification number',
        example: 'WBAFR9C50DD123456'
      },
      details: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ProductDetail'
        },
        description: 'Product details'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2025-01-01T00:00:00.000Z'
      },
      created_by: {
        type: 'string',
        format: 'uuid',
        description: 'Creator user ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2025-01-01T00:00:00.000Z'
      },
      updated_by: {
        type: 'string',
        format: 'uuid',
        description: 'Last updater user ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      deleted_at: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Deletion timestamp (null if not deleted)',
        example: null
      },
      deleted_by: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Deleter user ID',
        example: null
      },
      is_delete: {
        type: 'boolean',
        description: 'Soft delete flag',
        example: false
      }
    }
  },

  ProductInput: {
    type: 'object',
    properties: {
      product_name_en: {
        type: 'string',
        maxLength: 255,
        description: 'Product name in English',
        example: 'BMW X5 2020'
      },
      product_name_cn: {
        type: 'string',
        maxLength: 255,
        description: 'Product name in Chinese',
        example: '宝马X5 2020'
      },
      product_description: {
        type: 'string',
        maxLength: 1000,
        description: 'Product description',
        example: 'Complete vehicle with all parts'
      },
      vin_number: {
        type: 'string',
        maxLength: 255,
        description: 'Vehicle identification number',
        example: 'WBAFR9C50DD123456'
      },
      data_details: {
        type: 'array',
        description: 'Array of product details',
        items: {
          type: 'object',
          properties: {
            dokumen_id: {
              type: 'string',
              format: 'uuid',
              description: 'Document ID',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            product_detail_name_en: {
              type: 'string',
              maxLength: 255,
              description: 'Product detail name in English',
              example: 'Engine Assembly'
            },
            product_detail_name_cn: {
              type: 'string',
              maxLength: 255,
              description: 'Product detail name in Chinese',
              example: '发动机总成'
            },
            product_detail_description: {
              type: 'string',
              maxLength: 1000,
              description: 'Product detail description',
              example: 'Complete engine assembly with all components'
            }
          }
        }
      }
    }
  },

  ProductGetRequest: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Page number',
        example: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'Items per page',
        example: 10
      },
      search: {
        type: 'string',
        maxLength: 255,
        description: 'Search term',
        example: 'BMW'
      },
      sort_by: {
        type: 'string',
        enum: ['created_at', 'updated_at', 'product_name_en', 'product_name_cn', 'vin_number'],
        description: 'Sort field',
        example: 'created_at'
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Sort order',
        example: 'desc'
      }
    }
  },

  Pagination: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        description: 'Current page number',
        example: 1
      },
      limit: {
        type: 'integer',
        description: 'Items per page',
        example: 10
      },
      total: {
        type: 'integer',
        description: 'Total number of items',
        example: 100
      },
      totalPages: {
        type: 'integer',
        description: 'Total number of pages',
        example: 10
      }
    }
  },

  ProductListResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product'
            }
          },
          pagination: {
            $ref: '#/components/schemas/Pagination'
          }
        }
      }
    }
  },

  ProductResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Product'
      },
      message: {
        type: 'string',
        description: 'Response message',
        example: 'Data berhasil dibuat'
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      error: {
        type: 'string',
        description: 'Error message',
        example: 'Data tidak ditemukan'
      },
      details: {
        type: 'object',
        description: 'Additional error details',
        nullable: true
      }
    }
  }
};

module.exports = productsSchemas;

