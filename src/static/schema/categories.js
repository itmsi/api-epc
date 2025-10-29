/**
 * Swagger Schema Definitions for Categories Module
 */

const categoriesSchemas = {
  Category: {
    type: 'object',
    properties: {
      category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      master_category_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Foreign key to master category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      master_category_name_en: {
        type: 'string',
        nullable: true,
        description: 'Master category name in English',
        example: 'Electronics'
      },
      category_name_en: {
        type: 'string',
        nullable: true,
        description: 'Category name in English',
        example: 'Electronic Devices'
      },
      category_name_cn: {
        type: 'string',
        nullable: true,
        description: 'Category name in Chinese',
        example: '电子产品'
      },
      category_description: {
        type: 'string',
        nullable: true,
        description: 'Category description',
        example: 'Electronic devices and components'
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
      },
      data_type: {
        type: 'array',
        nullable: true,
        description: 'Array of type categories',
        items: {
          type: 'object',
          properties: {
            type_category_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Type category ID',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            type_category_name_en: {
              type: 'string',
              maxLength: 255,
              nullable: true,
              description: 'Type category name in English',
              example: 'Electronics'
            },
            type_category_name_cn: {
              type: 'string',
              maxLength: 255,
              nullable: true,
              description: 'Type category name in Chinese',
              example: '电子产品'
            },
            type_category_description: {
              type: 'string',
              nullable: true,
              description: 'Type category description',
              example: 'Electronic devices and components'
            }
          }
        }
      }
    }
  },
  CategoryInput: {
    type: 'object',
    properties: {
      master_category_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Foreign key to master category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      master_category_name_en: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        description: 'Master category name in English',
        example: 'Electronics'
      },
      category_name_cn: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        description: 'Category name in Chinese',
        example: '电子产品'
      },
      category_description: {
        type: 'string',
        nullable: true,
        description: 'Category description',
        example: 'Electronic devices and components'
      },
      data_type: {
        type: 'array',
        nullable: true,
        description: 'Array of type categories',
        items: {
          type: 'object',
          properties: {
            type_category_name_en: {
              type: 'string',
              maxLength: 255,
              nullable: true,
              description: 'Type category name in English',
              example: 'Electronics'
            },
            type_category_name_cn: {
              type: 'string',
              maxLength: 255,
              nullable: true,
              description: 'Type category name in Chinese',
              example: '电子产品'
            },
            type_category_description: {
              type: 'string',
              nullable: true,
              description: 'Type category description',
              example: 'Electronic devices and components'
            }
          }
        }
      }
    }
  },
  CategoryFilter: {
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
        example: 'electronics'
      },
      sort_by: {
        type: 'string',
        enum: ['created_at', 'master_category_name_en', 'category_name_cn'],
        description: 'Field to sort by',
        example: 'created_at'
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Sort order',
        example: 'desc'
      },
      master_category_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Filter by master category ID (UUID, null, or empty string)',
        example: '123e4567-e89b-12d3-a456-426614174000'
      }
    }
  },
  CategoryListResponse: {
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
              $ref: '#/components/schemas/Category'
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
  CategoryResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/Category'
      },
      message: {
        type: 'string',
        example: 'Category berhasil dibuat'
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

module.exports = categoriesSchemas;

