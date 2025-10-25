/**
 * Swagger Path Definitions for Master Category Module
 */

const masterCategoryPaths = {
  '/master_category/get': {
    post: {
      tags: ['Master Category'],
      summary: 'Get all master categories with pagination and filter',
      description: 'Retrieve master categories with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MasterCategoryFilter'
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
          description: 'Successfully retrieved master categories',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MasterCategoryListResponse'
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
  '/master_category/{id}': {
    get: {
      tags: ['Master Category'],
      summary: 'Get master category by ID',
      description: 'Retrieve a specific master category by its ID',
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
          description: 'Master category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved master category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MasterCategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Master category not found',
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
      tags: ['Master Category'],
      summary: 'Update master category',
      description: 'Update an existing master category',
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
          description: 'Master category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MasterCategoryInput'
            },
            example: {
              master_category_name_en: 'Updated Electronics',
              master_category_name_cn: '更新的电子产品',
              master_category_description: 'Updated electronic devices and components'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated master category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MasterCategoryResponse'
              }
            }
          }
        },
        404: {
          description: 'Master category not found',
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
      tags: ['Master Category'],
      summary: 'Delete master category (soft delete)',
      description: 'Soft delete a master category',
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
          description: 'Master category ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted master category',
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
                    example: 'Master category berhasil dihapus'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Master category not found',
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
  '/master_category/create': {
    post: {
      tags: ['Master Category'],
      summary: 'Create new master category',
      description: 'Create a new master category',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MasterCategoryInput'
            },
            example: {
              master_category_name_en: 'Electronics',
              master_category_name_cn: '电子产品',
              master_category_description: 'Electronic devices and components'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created master category',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MasterCategoryResponse'
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

module.exports = masterCategoryPaths;
