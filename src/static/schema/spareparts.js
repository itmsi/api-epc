/**
 * Swagger Schema Definitions for Spareparts Module
 */

const sparepartsSchemas = {
  Sparepart: {
    type: 'object',
    properties: {
      sparepart_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for sparepart',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      target_id: {
        type: 'string',
        maxLength: 255,
        description: 'Target ID',
        example: 'T001',
        nullable: true
      },
      part_number: {
        type: 'string',
        maxLength: 255,
        description: 'Part number',
        example: 'PN-12345',
        nullable: true
      },
      sparepart_name_en: {
        type: 'string',
        maxLength: 255,
        description: 'Sparepart name in English',
        example: 'Engine Oil Filter',
        nullable: true
      },
      sparepart_name_ch: {
        type: 'string',
        maxLength: 255,
        description: 'Sparepart name in Chinese',
        example: '机油滤清器',
        nullable: true
      },
      description: {
        type: 'string',
        description: 'Description of the sparepart',
        example: 'High quality engine oil filter',
        nullable: true
      },
      quantity: {
        type: 'integer',
        minimum: 0,
        description: 'Quantity',
        example: 2,
        default: 0
      },
      unit: {
        type: 'string',
        maxLength: 255,
        description: 'Unit of measurement',
        example: 'pcs',
        nullable: true
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
        description: 'User ID who created the record',
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true
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
        description: 'User ID who updated the record',
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true
      },
      deleted_at: {
        type: 'string',
        format: 'date-time',
        description: 'Deletion timestamp',
        example: '2025-01-01T00:00:00.000Z',
        nullable: true
      },
      deleted_by: {
        type: 'string',
        format: 'uuid',
        description: 'User ID who deleted the record',
        example: '123e4567-e89b-12d3-a456-426614174000',
        nullable: true
      },
      is_delete: {
        type: 'boolean',
        description: 'Soft delete flag',
        example: false,
        default: false
      }
    }
  },

  SparepartInput: {
    type: 'object',
    properties: {
      target_id: {
        type: 'string',
        maxLength: 255,
        description: 'Target ID',
        example: 'T001'
      },
      part_number: {
        type: 'string',
        maxLength: 255,
        description: 'Part number',
        example: 'PN-12345'
      },
      sparepart_name_en: {
        type: 'string',
        maxLength: 255,
        description: 'Sparepart name in English',
        example: 'Engine Oil Filter'
      },
      sparepart_name_ch: {
        type: 'string',
        maxLength: 255,
        description: 'Sparepart name in Chinese',
        example: '机油滤清器'
      },
      description: {
        type: 'string',
        description: 'Description of the sparepart',
        example: 'High quality engine oil filter'
      },
      quantity: {
        type: 'integer',
        minimum: 0,
        description: 'Quantity',
        example: 2,
        default: 0
      },
      unit: {
        type: 'string',
        maxLength: 255,
        description: 'Unit of measurement',
        example: 'pcs'
      }
    }
  },

  SparepartGetRequest: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Page number',
        example: 1,
        default: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'Items per page',
        example: 10,
        default: 10
      },
      search: {
        type: 'string',
        maxLength: 255,
        description: 'Search term',
        example: '',
        default: ''
      },
      sort_by: {
        type: 'string',
        enum: ['created_at', 'updated_at', 'sparepart_name_en', 'sparepart_name_ch', 'part_number', 'target_id'],
        description: 'Sort field',
        example: 'created_at',
        default: 'created_at'
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Sort order',
        example: 'desc',
        default: 'desc'
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

  SparepartListResponse: {
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
              $ref: '#/components/schemas/Sparepart'
            }
          },
          pagination: {
            $ref: '#/components/schemas/Pagination'
          }
        }
      },
      message: {
        type: 'string',
        description: 'Response message',
        example: 'Data berhasil diambil'
      }
    }
  },

  SparepartResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Sparepart'
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

module.exports = sparepartsSchemas;

