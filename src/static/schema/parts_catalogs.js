/**
 * Swagger Schema Definitions for Parts Catalogs Search Module
 */

const partsCatalogSchemas = {
  PartsCatalogProductItem: {
    type: 'object',
    properties: {
      product_id: { type: 'string', format: 'uuid' },
      vin_number: { type: 'string' },
      model_name: { type: 'string' },
      created_at: { type: 'string', format: 'date-time' }
    }
  },
  PartsCatalogSearchRequest: {
    type: 'object',
    required: ['data_code'],
    properties: {
      data_code: {
        type: 'string',
        description: 'VIN number atau part number yang ingin dicari',
        example: 'WBAFR9C50DD123456'
      },
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Halaman data (opsional, default 1)',
        example: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'Jumlah data per halaman (opsional, default 10)',
        example: 10
      }
    }
  },

  PartsCatalogSearchByVinRequest: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'VIN number atau keyword pencarian',
        example: 'LZGJR4V61RX035044'
      },
      customer_id: {
        type: 'string',
        nullable: true,
        description: 'ID Customer untuk validasi kepemilikan VIN (opsional)',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      page: {
        type: 'integer',
        minimum: 1,
        description: 'Halaman data (opsional, default 1)',
        example: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        description: 'Jumlah data per halaman (opsional, default 10)',
        example: 10
      },
      sort_by: {
        type: 'string',
        description: 'Field untuk sorting (opsional, default created_at)',
        example: 'created_at'
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        description: 'Urutan sorting (opsional, default desc)',
        example: 'desc'
      }
    }
  },

  PartsCatalogCategoryByVinRequest: {
    type: 'object',
    required: ['vin_number', 'customer_id'],
    properties: {
      vin_number: {
        type: 'string',
        description: 'VIN Number',
        example: 'LZGJR4V61RX035044'
      },
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID Customer',
        example: '123e4567-e89b-12d3-a456-426614174000'
      }
    }
  },

  PartsCatalogPagination: {
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
        example: 100
      },
      totalPages: {
        type: 'integer',
        example: 10
      }
    }
  },

  PartsCatalogItemDetail: {
    type: 'object',
    properties: {
      item_category_detail_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID detail item category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      part_number: {
        type: 'string',
        description: 'Part number',
        example: 'PN-12345'
      },
      catalog_item_name_en: {
        type: 'string',
        description: 'Nama item katalog (EN)',
        example: 'Engine Oil Filter'
      },
      catalog_item_name_ch: {
        type: 'string',
        description: 'Nama item katalog (CN)',
        example: '机油滤清器'
      }
    }
  },

  PartsCatalogItem: {
    type: 'object',
    properties: {
      item_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID item category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      item_category_name_en: {
        type: 'string',
        description: 'Nama item category (EN)',
        example: 'Engine Components'
      },
      item_category_name_cn: {
        type: 'string',
        description: 'Nama item category (CN)',
        example: '发动机组件'
      },
      item_category_foto: {
        type: 'string',
        format: 'uri',
        nullable: true,
        description: 'URL foto item category',
        example: 'https://example.com/images/item_1.jpg'
      },
      item_detail_data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/PartsCatalogItemDetail'
        }
      }
    }
  },

  PartsCatalogType: {
    type: 'object',
    properties: {
      type_category_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID type category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      type_category_name_en: {
        type: 'string',
        description: 'Nama type category (EN)',
        example: 'Electronics Type'
      },
      type_category_name_cn: {
        type: 'string',
        description: 'Nama type category (CN)',
        example: '电子产品类型'
      },
      type_category_code: {
        type: 'string',
        nullable: true,
        description: 'Kode type category',
        example: 'TYPE-001'
      },
      item_data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/PartsCatalogItem'
        }
      }
    }
  },

  PartsCatalogCategory: {
    type: 'object',
    properties: {
      category_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'ID category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      categories_code: {
        type: 'string',
        nullable: true,
        description: 'Kode category',
        example: '1234567890'
      },
      category_name_en: {
        type: 'string',
        description: 'Nama category (EN)',
        example: 'Electronic Devices'
      },
      category_name_cn: {
        type: 'string',
        description: 'Nama category (CN)',
        example: '电子产品'
      },
      sub_data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/PartsCatalogType'
        }
      }
    }
  },

  PartsCatalogMasterCategory: {
    type: 'object',
    properties: {
      master_category_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'ID master category',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      master_category_name_en: {
        type: 'string',
        description: 'Nama master category (EN)',
        example: 'Engine'
      },
      master_category_name_cn: {
        type: 'string',
        description: 'Nama master category (CN)',
        example: '电子产品'
      },
      category_data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/PartsCatalogCategory'
        }
      }
    }
  },

  PartsCatalogResponseVin: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['vin_number'],
            example: 'vin_number'
          },
          master_data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogMasterCategory'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogResponseCategory: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['part_number_1'],
            example: 'part_number_1'
          },
          category_data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogCategory'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogResponseType: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['part_number_2'],
            example: 'part_number_2'
          },
          sub_data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogType'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogResponseItem: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['part_number_3'],
            example: 'part_number_3'
          },
          item_data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogItem'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogResponseTypeCategoryId: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['type_category_id'],
            example: 'type_category_id'
          },
          sub_data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogType'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogResponseItemCategoryId: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['item_category_id'],
            example: 'item_category_id'
          },
          item_data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogItem'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      message: {
        type: 'string',
        example: 'Data tidak ditemukan'
      },
      errors: {
        type: 'object',
        nullable: true
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogResponseProduct: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data berhasil diambil'
      },
      data: {
        type: 'object',
        properties: {
          type_data: {
            type: 'string',
            enum: ['vin_number'],
            example: 'vin_number'
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PartsCatalogProductItem'
            }
          },
          pagination: {
            $ref: '#/components/schemas/PartsCatalogPagination'
          }
        }
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  PartsCatalogMasterCategoryQueryItem: {
    type: 'object',
    properties: {
      master_category_id: { type: 'string', format: 'uuid' },
      master_category_name_en: { type: 'string' }
    }
  },

  PartsCatalogProductInfo: {
    type: 'object',
    properties: {
      product_id: { type: 'string', format: 'uuid' },
      vin_number: { type: 'string' },
      product_name_en: { type: 'string' },
      product_name_cn: { type: 'string' },
      product_description: { type: 'string' }
    }
  },

  PartsCatalogResponseMasterCategoryQuery: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Data berhasil diambil' },
      data: {
        type: 'object',
        properties: {
          data_vin: { $ref: '#/components/schemas/PartsCatalogProductInfo' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/PartsCatalogMasterCategoryQueryItem' }
          },
          pagination: { $ref: '#/components/schemas/PartsCatalogPagination' }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },

  PartsCatalogCategoryByMasterIdRequest: {
    type: 'object',
    required: ['product_id', 'customer_id'],
    properties: {
      master_category_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'ID Master Category',
        example: '1e30e77b-1663-47d9-9cb0-67531c831516'
      },
      dokumen_ids: {
        type: 'array',
        items: {
          type: 'string',
          format: 'uuid'
        },
        nullable: true,
        description: 'List of Document IDs',
        example: ['1886f775-208e-4e6f-ba7e-7b62673ed22c', 'b8c50159-4ad3-4ab6-b5d4-f5e3d9be7407']
      },
      product_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID Product (untuk validasi)',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      customer_id: {
        type: 'string',
        format: 'uuid',
        description: 'ID Customer (untuk validasi)',
        example: '123e4567-e89b-12d3-a456-426614174000'
      },
      search: {
        type: 'string',
        nullable: true,
        description: 'Keyword pencarian (opsional)',
        example: 'LZGJR4V61RX035044'
      },
      page: {
        type: 'integer',
        minimum: 1,
        default: 1
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10
      },
      sort_by: {
        type: 'string',
        default: 'created_at'
      },
      sort_order: {
        type: 'string',
        enum: ['asc', 'desc'],
        default: 'desc'
      }
    }
  },

  PartsCatalogVariableCategoryItem: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      id_link: { type: 'string', format: 'uuid', nullable: true },
      name: { type: 'string' },
      name_cn: { type: 'string' },
      description: { type: 'string', nullable: true },
      child: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', nullable: true },
            id_link: { type: 'string', format: 'uuid', nullable: true },
            name: { type: 'string', nullable: true },
            name_cn: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            child: {
              type: 'array',
              items: { type: 'object' } // Recursion or just empty array as per spec
            }
          }
        }
      }
    }
  },

  PartsCatalogResponseCategoryByMasterId: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Data berhasil diambil' },
      data: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/PartsCatalogVariableCategoryItem' }
          },
          pagination: { $ref: '#/components/schemas/PartsCatalogPagination' }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },

  UpdateProductRequest: {
    type: 'object',
    properties: {
      product_name_en: { type: 'string', nullable: true },
      product_name_cn: { type: 'string', nullable: true },
      product_description: { type: 'string', nullable: true },
      vin_number: { type: 'string', nullable: true },
      model_type: { type: 'string', nullable: true },
      dimensi: { type: 'string', nullable: true },
      model_engine: { type: 'string', nullable: true },
      body_number: { type: 'string', nullable: true }
    }
  },

  UpdateProductResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Data berhasil diperbarui' },
      data: {
        type: 'object',
        properties: {
          product_id: { type: 'string', format: 'uuid' },
          product_name_en: { type: 'string' },
          product_name_cn: { type: 'string' },
          product_description: { type: 'string' },
          vin_number: { type: 'string' },
          model_type: { type: 'string' },
          dimensi: { type: 'string' },
          model_engine: { type: 'string' },
          body_number: { type: 'string' }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },

  GetProductResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Data berhasil diambil' },
      data: {
        type: 'object',
        properties: {
          product_id: { type: 'string', format: 'uuid' },
          product_name_en: { type: 'string' },
          product_name_cn: { type: 'string' },
          product_description: { type: 'string' },
          vin_number: { type: 'string' },
          model_type: { type: 'string' },
          dimensi: { type: 'string' },
          model_engine: { type: 'string' },
          body_number: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },

  GetItemDetailsByItemCategoryIdResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Data berhasil diambil' },
      data: {
        type: 'object',
        properties: {
          header: {
            type: 'object',
            properties: {
              item_category_foto: { type: 'string', nullable: true },
              category_name_en: { type: 'string' },
              category_name_cn: { type: 'string' },
              type_category_name_cn: { type: 'string', nullable: true },
              type_category_name_en: { type: 'string', nullable: true }
            }
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                item_category_detail_id: { type: 'string', format: 'uuid' },
                target_id: { type: 'string', nullable: true },
                quantity: { type: 'integer' },
                master_item_name_en: { type: 'string' },
                master_item_name_ch: { type: 'string', description: 'Mapped from cn' },
                part_number: { type: 'string' },
                description: { type: 'string' }
              }
            }
          }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  }
};

module.exports = partsCatalogSchemas;

