/**
 * Swagger Path Definitions for Products Module
 */

const productsPaths = {
  '/products/get': {
    post: {
      tags: ['Products'],
      summary: 'Get all products with pagination and filters',
      description: 'Retrieve products with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductGetRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully retrieved products',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductListResponse'
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

  '/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Get product by ID',
      description: 'Retrieve a specific product with all related data including details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved product',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductResponse'
              }
            }
          }
        },
        404: {
          description: 'Product not found',
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
      tags: ['Products'],
      summary: 'Update product',
      description: 'Update an existing product with details',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductInput'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated product',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductResponse'
              }
            }
          }
        },
        404: {
          description: 'Product not found',
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
      tags: ['Products'],
      summary: 'Delete product',
      description: 'Soft delete a product',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Product ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted product',
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
          description: 'Product not found',
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

  '/products/create': {
    post: {
      tags: ['Products'],
      summary: 'Create new product',
      description: 'Create a new product with details',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductInput'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created product',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductResponse'
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

module.exports = productsPaths;

