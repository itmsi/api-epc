/**
 * Swagger Path Definitions for Item Category Module
 */

const itemCategoryPaths = {
  '/item_category/get': {
    post: {
      tags: ['Item Category'],
      summary: 'Get all item categories with pagination and filters',
      description: 'Retrieve item categories with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ItemCategoryGetRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully retrieved item categories',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ItemCategoryListResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },

  '/item_category/dokumen/{dokumen_id}': {
    get: {
      tags: ['Item Category'],
      summary: 'Get item categories by dokumen ID',
      description: 'Retrieve all item categories for a specific dokumen with category and type_category info',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'dokumen_id',
          in: 'path',
          required: true,
          description: 'Dokumen ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          description: 'Page number',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          description: 'Items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        {
          name: 'sort_by',
          in: 'query',
          required: false,
          description: 'Sort field',
          schema: {
            type: 'string',
            enum: ['created_at', 'updated_at', 'item_category_name_en', 'item_category_name_cn'],
            default: 'created_at'
          }
        },
        {
          name: 'sort_order',
          in: 'query',
          required: false,
          description: 'Sort order',
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved item categories',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ItemCategoryByDokumenResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },

  '/item_category/{id}': {
    get: {
      tags: ['Item Category'],
      summary: 'Get item category by ID',
      description: 'Retrieve a specific item category with all related data including details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Item category ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved item category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ItemCategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Item category not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },

    put: {
      tags: ['Item Category'],
      summary: 'Update item category',
      description: 'Update an existing item category with details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Item category ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                dokumen_name: {
                  type: 'string',
                  description: 'Document name'
                },
                master_category_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Master category ID'
                },
                category_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Category ID (optional - use if type_category_id is not provided)'
                },
                type_category_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Type category ID (optional - use if category_id is not provided)'
                },
                item_category_name_en: {
                  type: 'string',
                  description: 'Item category name in English'
                },
                item_category_name_cn: {
                  type: 'string',
                  description: 'Item category name in Chinese'
                },
                item_category_description: {
                  type: 'string',
                  description: 'Item category description'
                },
                file_foto: {
                  type: 'string',
                  format: 'binary',
                  description: 'Photo file'
                },
                data_items: {
                  type: 'string',
                  description: 'JSON string of data items array',
                  example: '[{"target_id":"T001","part_number":"PN-12345","catalog_item_name_en":"Engine Oil Filter","catalog_item_name_ch":"机油滤清器","description":"High quality engine oil filter","quantity":2,"unit":"pcs"},{"target_id":"T002","part_number":"PN-12346","catalog_item_name_en":"Air Filter","catalog_item_name_ch":"空气滤清器","description":"High quality air filter","quantity":1,"unit":"pcs"}]'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated item category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ItemCategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Item category not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },

    delete: {
      tags: ['Item Category'],
      summary: 'Delete item category',
      description: 'Soft delete an item category',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Item category ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted item category',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: 'Data berhasil dihapus'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Item category not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  },

  '/item_category/create': {
    post: {
      tags: ['Item Category'],
      summary: 'Create new item category',
      description: 'Create a new item category with details and optional photo upload',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['master_category_id'],
              properties: {
                dokumen_name: {
                  type: 'string',
                  description: 'Document name (will create if not exists)'
                },
                master_category_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Master category ID'
                },
                category_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Category ID (optional - use if type_category_id is not provided)'
                },
                type_category_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Type category ID (optional - use if category_id is not provided)'
                },
                item_category_name_en: {
                  type: 'string',
                  description: 'Item category name in English'
                },
                item_category_name_cn: {
                  type: 'string',
                  description: 'Item category name in Chinese'
                },
                item_category_description: {
                  type: 'string',
                  description: 'Item category description'
                },
                file_foto: {
                  type: 'string',
                  format: 'binary',
                  description: 'Photo file'
                },
                data_items: {
                  type: 'string', 
                  description: 'JSON string of data items array',
                  example: '[{"target_id":"T001","part_number":"PN-12345","catalog_item_name_en":"Engine Oil Filter","catalog_item_name_ch":"机油滤清器","description":"High quality engine oil filter","quantity":2,"unit":"pcs"},{"target_id":"T002","part_number":"PN-12346","catalog_item_name_en":"Air Filter","catalog_item_name_ch":"空气滤清器","description":"High quality air filter","quantity":1,"unit":"pcs"}]'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created item category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ItemCategoryResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        500: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  }
};

module.exports = itemCategoryPaths;
