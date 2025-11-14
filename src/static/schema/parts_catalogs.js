/**
 * Swagger Schema Definitions for Parts Catalogs Search Module
 */

const partsCatalogSchemas = {
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
  }
};

module.exports = partsCatalogSchemas;

