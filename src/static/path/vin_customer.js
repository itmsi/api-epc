/**
 * Swagger Path Definitions for VIN Customer Module
 */

const vinCustomerPaths = {
  '/vin_customer': {
    post: {
      tags: ['VIN Customer'],
      summary: 'Get all vin_customer records with pagination',
      description: 'Retrieve all customer-product relationships with pagination and optional filters',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                  description: 'Page number'
                },
                limit: {
                  type: 'integer',
                  example: 10,
                  description: 'Items per page'
                },
                search: {
                  type: 'string',
                  description: 'Search term for product name, VIN number, or customer name'
                },
                sort_by: {
                  type: 'string',
                  enum: ['created_at', 'updated_at', 'product_name_en', 'vin_number', 'customer_name'],
                  example: 'created_at',
                  description: 'Field to sort by'
                },
                sort_order: {
                  type: 'string',
                  enum: ['asc', 'desc'],
                  example: 'desc',
                  description: 'Sort order'
                },
                customer_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Optional: Filter by customer ID'
                },
                product_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Optional: Filter by product ID'
                }
              }
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
          description: 'Successfully retrieved vin_customer records',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VinCustomerListResponse'
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

  '/vin_customer/{customerId}': {
    get: {
      tags: ['VIN Customer'],
      summary: 'Get customer by ID with their products',
      description: 'Retrieve customer with all their assigned products (grouped format)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'customerId',
          in: 'path',
          required: true,
          description: 'Customer ID from SSO',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved customer with products',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  code: {
                    type: 'integer',
                    example: 200
                  },
                  message: {
                    type: 'string',
                    example: 'Data berhasil diambil'
                  },
                  data: {
                    $ref: '#/components/schemas/CustomerWithProducts'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'VIN Customer record not found',
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
      tags: ['VIN Customer'],
      summary: 'Update - replace all products for a customer',
      description: 'Replace all products assigned to a customer with new ones. Auto-handles single or multiple products.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'customerId',
          in: 'path',
          required: true,
          description: 'Customer ID from SSO',
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
              type: 'object',
              required: ['product_ids'],
              properties: {
                product_ids: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uuid'
                  },
                  description: 'Array of product IDs (can be single or multiple)',
                  example: ['987fcdeb-51a2-43d7-b123-987654321abc', '456defgh-12a3-45b6-c789-012345678def']
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated products for customer',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VinCustomerBulkCreateResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad Request - Invalid product ID',
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

    delete: {
      tags: ['VIN Customer'],
      summary: 'Remove - delete all products for a customer',
      description: 'Delete all vin_customer records for a specific customer',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'customerId',
          in: 'path',
          required: true,
          description: 'Customer ID from SSO',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted all products for customer',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  code: {
                    type: 'integer',
                    example: 200
                  },
                  message: {
                    type: 'string',
                    example: 'Berhasil menghapus 3 product untuk customer'
                  },
                  data: {
                    type: 'null'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'No records found for customer',
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

  '/vin_customer/create': {
    post: {
      tags: ['VIN Customer'],
      summary: 'Create vin_customer record(s)',
      description: 'Assign one or multiple products to a customer. Supports both single product and bulk assignment.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              oneOf: [
                {
                  $ref: '#/components/schemas/VinCustomerCreateSingle'
                },
                {
                  $ref: '#/components/schemas/VinCustomerCreateBulk'
                }
              ]
            },
            examples: {
              single: {
                summary: 'Single product assignment',
                value: {
                  customer_id: '123e4567-e89b-12d3-a456-426614174000',
                  product_id: '987fcdeb-51a2-43d7-b123-987654321abc'
                }
              },
              bulk: {
                summary: 'Multiple products assignment',
                value: {
                  customer_id: '123e4567-e89b-12d3-a456-426614174000',
                  product_ids: [
                    '987fcdeb-51a2-43d7-b123-987654321abc',
                    '456defgh-12a3-45b6-c789-012345678def',
                    '789abcde-67f8-90g1-h234-567890123hij'
                  ]
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created vin_customer record(s)',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VinCustomerCreateResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad Request - Invalid input or missing required fields',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        409: {
          description: 'Conflict - Customer already has this product',
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

module.exports = vinCustomerPaths;
