/**
 * Swagger Schema Definitions for Unit Module
 */

const unitSchemas = {
  Unit: {
    type: 'object',
    properties: {
      unit_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      unit_name_en: {
        type: 'string',
        nullable: true,
        description: 'Unit name in English',
        example: 'Kilogram'
      },
      unit_name_cn: {
        type: 'string',
        nullable: true,
        description: 'Unit name in Chinese',
        example: '千克'
      },
      unit_description: {
        type: 'string',
        nullable: true,
        description: 'Unit description',
        example: 'Unit of mass'
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
        nullable: true,
        description: 'User ID who created the record',
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
        nullable: true,
        description: 'User ID who last updated the record',
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
        description: 'User ID who deleted the record',
        example: null
      },
      is_delete: {
        type: 'boolean',
        description: 'Soft delete flag',
        example: false
      }
    }
  },
  UnitInput: {
    type: 'object',
    properties: {
      unit_name_en: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        description: 'Unit name in English',
        example: 'Kilogram'
      },
      unit_name_cn: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        description: 'Unit name in Chinese',
        example: '千克'
      },
      unit_description: {
        type: 'string',
        nullable: true,
        description: 'Unit description',
        example: 'Unit of mass'
      }
    }
  },
  UnitFilter: {
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
        description: 'Search term for name or description',
        example: 'kilogram'
      },
      sort_by: {
        type: 'string',
        enum: ['created_at', 'unit_name_en', 'unit_name_cn'],
        description: 'Field to sort by',
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
  UnitListResponse: {
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
              $ref: '#/components/schemas/Unit'
            }
          },
          pagination: {
            $ref: '#/components/schemas/Pagination'
          }
        }
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      }
    }
  },
  UnitResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Unit'
      },
      message: {
        type: 'string',
        example: 'Unit berhasil dibuat'
      }
    }
  }
};

module.exports = unitSchemas;

