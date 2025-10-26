/**
 * Swagger Schema Definitions for Item Category Module
 */

const itemCategorySchemas = {
  ItemCategoryDetail: {
    type: 'object',
    properties: {
      item_category_detail_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for item category detail',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      item_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Reference to item category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      target_id: {
        type: 'string',
        description: 'Target ID',
        example: 'T001'
      },
      part_number: {
        type: 'string',
        description: 'Part number',
        example: 'PN-12345'
      },
      catalog_item_name_en: {
        type: 'string',
        description: 'Catalog item name in English',
        example: 'Engine Oil Filter'
      },
      catalog_item_name_ch: {
        type: 'string',
        description: 'Catalog item name in Chinese',
        example: '机油滤清器'
      },
      description: {
        type: 'string',
        description: 'Description of the item',
        example: 'High quality engine oil filter'
      },
      quantity: {
        type: 'integer',
        description: 'Quantity',
        example: 2
      },
      unit: {
        type: 'string',
        description: 'Unit of measurement',
        example: 'pcs'
      },
      unit_name_en: {
        type: 'string',
        description: 'Unit name in English',
        example: 'pieces'
      },
      unit_name_cn: {
        type: 'string',
        description: 'Unit name in Chinese',
        example: '件'
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

  ItemCategory: {
    type: 'object',
    properties: {
      item_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      type_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Reference to type category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      dokumen_id: {
        type: 'string',
        format: 'uuid',
        description: 'Reference to document',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      item_category_name_en: {
        type: 'string',
        description: 'Item category name in English',
        example: 'Engine Components'
      },
      item_category_name_cn: {
        type: 'string',
        description: 'Item category name in Chinese',
        example: '发动机组件'
      },
      item_category_description: {
        type: 'string',
        description: 'Item category description',
        example: 'High quality engine components'
      },
      item_category_foto: {
        type: 'string',
        description: 'Photo URL/path',
        example: '/uploads/item_categories/photo.jpg'
      },
      dokumen_name: {
        type: 'string',
        description: 'Document name',
        example: 'Engine Manual'
      },
      dokumen_description: {
        type: 'string',
        description: 'Document description',
        example: 'Complete engine maintenance manual'
      },
      type_category_name_en: {
        type: 'string',
        description: 'Type category name in English',
        example: 'Engine Parts'
      },
      type_category_name_cn: {
        type: 'string',
        description: 'Type category name in Chinese',
        example: '发动机零件'
      },
      category_name_en: {
        type: 'string',
        description: 'Category name in English',
        example: 'Automotive Parts'
      },
      category_name_cn: {
        type: 'string',
        description: 'Category name in Chinese',
        example: '汽车零件'
      },
      master_category_name_en: {
        type: 'string',
        description: 'Master category name in English',
        example: 'Vehicle Components'
      },
      master_category_name_cn: {
        type: 'string',
        description: 'Master category name in Chinese',
        example: '车辆组件'
      },
      details: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ItemCategoryDetail'
        },
        description: 'Item category details'
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

  ItemCategoryInput: {
    type: 'object',
    required: ['master_category_id', 'category_id', 'type_category_id'],
    properties: {
      dokumen_name: {
        type: 'string',
        maxLength: 255,
        description: 'Document name (will create if not exists)',
        example: 'Engine Manual'
      },
      master_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Master category ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      type_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'Type category ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      item_category_name_en: {
        type: 'string',
        maxLength: 255,
        description: 'Item category name in English',
        example: 'Engine Components'
      },
      item_category_name_cn: {
        type: 'string',
        maxLength: 255,
        description: 'Item category name in Chinese',
        example: '发动机组件'
      },
      item_category_description: {
        type: 'string',
        maxLength: 1000,
        description: 'Item category description',
        example: 'High quality engine components'
      },
      data_items: {
        type: 'array',
        description: 'Array of item details',
        items: {
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
            catalog_item_name_en: {
              type: 'string',
              maxLength: 255,
              description: 'Catalog item name in English',
              example: 'Engine Oil Filter'
            },
            catalog_item_name_ch: {
              type: 'string',
              maxLength: 255,
              description: 'Catalog item name in Chinese',
              example: '机油滤清器'
            },
            description: {
              type: 'string',
              maxLength: 1000,
              description: 'Description of the item',
              example: 'High quality engine oil filter'
            },
            quantity: {
              type: 'integer',
              minimum: 0,
              description: 'Quantity',
              example: 2
            },
            unit: {
              type: 'string',
              maxLength: 255,
              description: 'Unit of measurement (will create if not exists)',
              example: 'pcs'
            }
          }
        }
      }
    }
  },

  ItemCategoryGetRequest: {
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
        example: 'engine'
      },
      sort_by: {
        type: 'string',
        enum: ['created_at', 'updated_at', 'item_category_name_en', 'item_category_name_cn'],
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

  ItemCategoryListResponse: {
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
              $ref: '#/components/schemas/ItemCategory'
            }
          },
          pagination: {
            $ref: '#/components/schemas/Pagination'
          }
        }
      }
    }
  },

  ItemCategoryResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      data: {
        $ref: '#/components/schemas/ItemCategory'
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

module.exports = itemCategorySchemas;
