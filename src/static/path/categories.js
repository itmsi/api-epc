/**
 * Swagger Path Definitions for Categories Module
 */

const categoriesPaths = {
  '/categories/get': {
    post: {
      tags: ['Categories'],
      summary: 'Get all categories with pagination and filter',
      description: 'Retrieve categories with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CategoryFilter'
            },
            example: {
              page: 1,
              limit: 10,
              search: '',
              sort_by: 'created_at',
              sort_order: 'desc'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully retrieved categories',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryListResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad request',
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
        }
      }
    }
  },
  '/categories/{id}': {
    get: {
      tags: ['Categories'],
      summary: 'Get category by ID',
      description: 'Retrieve a specific category by its ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Category not found',
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
        }
      }
    },
    put: {
      tags: ['Categories'],
      summary: 'Update category',
      description: 'Update an existing category',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CategoryInput'
            },
            example: {
              master_category_id: '123e4567-e89b-12d3-a456-426614174000',
              master_category_name_en: 'Updated Electronics',
              category_name_cn: '更新的电子产品',
              category_description: 'Updated electronic devices and components'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Category not found',
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
        }
      }
    },
    delete: {
      tags: ['Categories'],
      summary: 'Delete category (soft delete)',
      description: 'Soft delete a category',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'Category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted category',
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
                    example: 'Category berhasil dihapus'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Category not found',
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
        }
      }
    }
  },
  '/categories/create': {
    post: {
      tags: ['Categories'],
      summary: 'Create new category',
      description: 'Create a new category',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CategoryInput'
            },
            example: {
              master_category_id: '123e4567-e89b-12d3-a456-426614174000',
              master_category_name_en: 'Electronics',
              category_name_cn: '电子产品',
              category_description: 'Electronic devices and components'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CategoryResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad request',
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
        }
      }
    }
  }
};

module.exports = categoriesPaths;

