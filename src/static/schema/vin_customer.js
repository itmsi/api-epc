/**
 * Swagger Schema Definitions for VIN Customer Module
 */

const vinCustomerSchemas = {
  VinCustomer: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for vin_customer record',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID from SSO API',
        example: '987fcdeb-51a2-43d7-b123-987654321abc'
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID from products table',
        example: '456defgh-12a3-45b6-c789-012345678def'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2025-02-10T10:00:00.000Z'
      },
      created_by: {
        type: 'string',
        format: 'uuid',
        description: 'Creator user ID',
        example: '789abcde-67f8-90g1-h234-567890123hij'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2025-02-10T10:00:00.000Z'
      },
      updated_by: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Last updater user ID',
        example: '789abcde-67f8-90g1-h234-567890123hij'
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
        description: 'Deleter user ID',
        example: null
      },
      is_delete: {
        type: 'boolean',
        description: 'Soft delete flag',
        example: false
      }
    }
  },

  VinCustomerWithProduct: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Unique identifier for vin_customer record',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID from SSO API',
        example: '987fcdeb-51a2-43d7-b123-987654321abc'
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID',
        example: '456defgh-12a3-45b6-c789-012345678def'
      },
      product_name_en: {
        type: 'string',
        nullable: true,
        description: 'Product name in English',
        example: 'BMW X5 2020'
      },
      product_name_cn: {
        type: 'string',
        nullable: true,
        description: 'Product name in Chinese',
        example: '宝马X5 2020'
      },
      product_description: {
        type: 'string',
        nullable: true,
        description: 'Product description',
        example: 'Complete vehicle with all parts'
      },
      vin_number: {
        type: 'string',
        nullable: true,
        description: 'Vehicle identification number',
        example: 'WBAFR9C50DD123456'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2025-02-10T10:00:00.000Z'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2025-02-10T10:00:00.000Z'
      }
    }
  },

  VinCustomerCreateSingle: {
    type: 'object',
    required: ['customer_id', 'product_id'],
    properties: {
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID from SSO API',
        example: '987fcdeb-51a2-43d7-b123-987654321abc'
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID to assign',
        example: '456defgh-12a3-45b6-c789-012345678def'
      }
    }
  },

  VinCustomerCreateBulk: {
    type: 'object',
    required: ['customer_id', 'product_ids'],
    properties: {
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID from SSO API',
        example: '987fcdeb-51a2-43d7-b123-987654321abc'
      },
      product_ids: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'string',
          format: 'uuid'
        },
        description: 'Array of product IDs to assign',
        example: [
          '456defgh-12a3-45b6-c789-012345678def',
          '789abcde-67f8-90g1-h234-567890123hij',
          '012fghij-34k5-67l8-m901-234567890klm'
        ]
      }
    }
  },

  VinCustomerUpdateInput: {
    type: 'object',
    properties: {
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID from SSO API',
        example: '987fcdeb-51a2-43d7-b123-987654321abc'
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID',
        example: '456defgh-12a3-45b6-c789-012345678def'
      }
    }
  },

  ProductInCustomer: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'VIN Customer record ID',
        example: '3e899908-bdef-4c67-ba56-c05e0c9a60cc'
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'Product ID',
        example: '0971ab13-af9b-470c-93b8-55b182fbc6ae'
      },
      product_name_en: {
        type: 'string',
        description: 'Product name in English',
        example: 'X3000 - 8 X 4'
      },
      product_name_cn: {
        type: 'string',
        description: 'Product name in Chinese',
        example: 'X3000 - 8 X 4'
      },
      vin_number: {
        type: 'string',
        nullable: true,
        description: 'Vehicle identification number',
        example: 'LZGJR4V62RX035022'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp',
        example: '2026-02-10T04:00:29.352Z'
      },
      created_by: {
        type: 'string',
        format: 'uuid',
        description: 'Creator user ID',
        example: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp',
        example: '2026-02-10T04:00:29.352Z'
      },
      updated_by: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'Last updater user ID',
        example: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5'
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
        description: 'Deleter user ID',
        example: null
      },
      is_delete: {
        type: 'boolean',
        description: 'Soft delete flag',
        example: false
      }
    }
  },

  CustomerListItem: {
    type: 'object',
    properties: {
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID',
        example: 'dfa8c7b7-d65b-4619-a730-d12de57416ea'
      },
      customer_name: {
        type: 'string',
        nullable: true,
        description: 'Customer name from SSO database',
        example: 'PT Haris Testing'
      },
      count: {
        type: 'integer',
        description: 'Number of products assigned to this customer',
        example: 3
      }
    }
  },

  CustomerWithProducts: {
    type: 'object',
    properties: {
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'Customer ID',
        example: 'dfa8c7b7-d65b-4619-a730-d12de57416ea'
      },
      customer_name: {
        type: 'string',
        nullable: true,
        description: 'Customer name from SSO database',
        example: 'PT Haris Testing'
      },
      count: {
        type: 'integer',
        description: 'Total number of products for this customer',
        example: 3
      },
      products: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ProductInCustomer'
        }
      },
      pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1
          },
          limit: {
            type: 'integer',
            example: 10
          },
          total: {
            type: 'integer',
            description: 'Total number of products',
            example: 25
          },
          totalPages: {
            type: 'integer',
            example: 3
          }
        }
      }
    }
  },

  VinCustomerListResponse: {
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
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CustomerListItem'
            }
          },
          pagination: {
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
                description: 'Total number of customers',
                example: 5
              },
              totalPages: {
                type: 'integer',
                description: 'Total number of pages',
                example: 1
              }
            }
          }
        }
      }
    }
  },

  VinCustomerResponse: {
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
        description: 'Response message',
        example: 'Data berhasil diambil'
      },
      data: {
        $ref: '#/components/schemas/VinCustomerWithProduct'
      }
    },
    example: {
      success: true,
      code: 200,
      message: 'Data berhasil diambil',
      data: {
        id: '3e899908-bdef-4c67-ba56-c05e0c9a60cc',
        customer_id: 'dfa8c7b7-d65b-4619-a730-d12de57416ea',
        product_id: '0971ab13-af9b-470c-93b8-55b182fbc6ae',
        created_at: '2026-02-10T04:00:29.352Z',
        created_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
        updated_at: '2026-02-10T04:00:29.352Z',
        updated_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
        deleted_at: null,
        deleted_by: null,
        is_delete: false,
        product_name_en: 'X3000 - 8 X 4',
        product_name_cn: 'X3000 - 8 X 4',
        vin_number: 'LZGJR4V62RX035022',
        customer_name: 'PT Haris Testing'
      }
    }
  },

  VinCustomerCreateResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      code: {
        type: 'integer',
        example: 201
      },
      message: {
        type: 'string',
        description: 'Success message',
        example: 'Berhasil menambahkan product untuk customer'
      },
      data: {
        oneOf: [
          {
            $ref: '#/components/schemas/VinCustomer'
          },
          {
            type: 'array',
            items: {
              $ref: '#/components/schemas/VinCustomer'
            }
          }
        ],
        description: 'Created record(s) - single object for single insert, array for bulk insert'
      }
    },
    example: {
      success: true,
      code: 201,
      message: 'Berhasil menambahkan product untuk customer',
      data: {
        id: '3e899908-bdef-4c67-ba56-c05e0c9a60cc',
        customer_id: 'dfa8c7b7-d65b-4619-a730-d12de57416ea',
        product_id: '0971ab13-af9b-470c-93b8-55b182fbc6ae',
        created_at: '2026-02-10T04:00:29.352Z',
        created_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
        updated_at: '2026-02-10T04:00:29.352Z',
        updated_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
        deleted_at: null,
        deleted_by: null,
        is_delete: false
      }
    }
  },

  VinCustomerBulkCreateResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      code: {
        type: 'integer',
        example: 201
      },
      message: {
        type: 'string',
        description: 'Success message with count',
        example: 'Berhasil menambahkan 3 product untuk customer'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/VinCustomer'
        }
      }
    },
    example: {
      success: true,
      code: 201,
      message: 'Berhasil menambahkan 3 product untuk customer',
      data: [
        {
          id: '3e899908-bdef-4c67-ba56-c05e0c9a60cc',
          customer_id: 'dfa8c7b7-d65b-4619-a730-d12de57416ea',
          product_id: '0971ab13-af9b-470c-93b8-55b182fbc6ae',
          created_at: '2026-02-10T04:00:29.352Z',
          created_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
          updated_at: '2026-02-10T04:00:29.352Z',
          updated_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
          deleted_at: null,
          deleted_by: null,
          is_delete: false
        },
        {
          id: '4f9aa019-ceef-5d78-cb67-d16f1d0b71dd',
          customer_id: 'dfa8c7b7-d65b-4619-a730-d12de57416ea',
          product_id: '1a82bc24-bg0c-581d-a4c9-66c293gcd7bf',
          created_at: '2026-02-10T04:00:29.352Z',
          created_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
          updated_at: '2026-02-10T04:00:29.352Z',
          updated_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
          deleted_at: null,
          deleted_by: null,
          is_delete: false
        },
        {
          id: '5g0bb12a-dffc-6e89-dc78-e27g2e1c82ee',
          customer_id: 'dfa8c7b7-d65b-4619-a730-d12de57416ea',
          product_id: '2b93cd35-ch1d-692e-b5da-77d304hde8cg',
          created_at: '2026-02-10T04:00:29.352Z',
          created_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
          updated_at: '2026-02-10T04:00:29.352Z',
          updated_by: 'f0b57258-5f33-4e03-81f7-cd70d833b5c5',
          deleted_at: null,
          deleted_by: null,
          is_delete: false
        }
      ]
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      message: {
        type: 'string',
        description: 'Error message',
        example: 'Data tidak ditemukan'
      },
      errors: {
        type: 'object',
        description: 'Additional error details',
        nullable: true
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Error timestamp',
        example: '2025-02-10T10:00:00.000Z'
      }
    }
  }
};

module.exports = vinCustomerSchemas;
