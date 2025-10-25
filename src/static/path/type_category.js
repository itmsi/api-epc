/**
 * Swagger Path Definitions for Type Category Module
 */

const typeCategoryPaths = {
  '/type_category/get': {
    post: {
      tags: ['Type Category'],
      summary: 'Get all type categories with pagination and filter',
      description: 'Retrieve type categories with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/TypeCategoryFilter'
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
          description: 'Successfully retrieved type categories',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TypeCategoryListResponse'
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
  '/type_category/{id}': {
    get: {
      tags: ['Type Category'],
      summary: 'Get type category by ID',
      description: 'Retrieve a specific type category by its ID',
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
          description: 'Type Category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved type category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TypeCategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Type category not found',
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
      tags: ['Type Category'],
      summary: 'Update type category',
      description: 'Update an existing type category',
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
          description: 'Type Category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/TypeCategoryInput'
            },
            example: {
              category_id: '123e4567-e89b-12d3-a456-426614174000',
              type_category_name_en: 'Updated Electronics Type',
              type_category_name_cn: '更新的电子产品类型',
              type_category_description: 'Updated electronic device types and components'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated type category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TypeCategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Type category not found',
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
      tags: ['Type Category'],
      summary: 'Delete type category (soft delete)',
      description: 'Soft delete a type category',
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
          description: 'Type Category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted type category',
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
                    example: 'Type Category berhasil dihapus'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Type category not found',
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
  '/type_category/create': {
    post: {
      tags: ['Type Category'],
      summary: 'Create new type category',
      description: 'Create a new type category',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/TypeCategoryInput'
            },
            example: {
              category_id: '123e4567-e89b-12d3-a456-426614174000',
              type_category_name_en: 'Electronics Type',
              type_category_name_cn: '电子产品类型',
              type_category_description: 'Electronic device types and components'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created type category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TypeCategoryResponse'
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

module.exports = typeCategoryPaths;
