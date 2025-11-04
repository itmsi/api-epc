/**
 * Swagger Path Definitions for Spareparts Module
 */

const sparepartsPaths = {
  '/spareparts/get': {
    post: {
      tags: ['Spareparts'],
      summary: 'Get all spareparts with pagination and filters',
      description: 'Retrieve spareparts with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SparepartGetRequest'
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
          description: 'Successfully retrieved spareparts',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SparepartListResponse'
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

  '/spareparts/create': {
    post: {
      tags: ['Spareparts'],
      summary: 'Create new sparepart',
      description: 'Create a new sparepart',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SparepartInput'
            },
            example: {
              target_id: 'T001',
              part_number: 'PN-12345',
              sparepart_name_en: 'Engine Oil Filter',
              sparepart_name_ch: '机油滤清器',
              description: 'High quality engine oil filter',
              quantity: 2,
              unit: 'pcs'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created sparepart',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SparepartResponse'
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
  },

  '/spareparts/{id}': {
    get: {
      tags: ['Spareparts'],
      summary: 'Get sparepart by ID',
      description: 'Retrieve a specific sparepart by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Sparepart ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved sparepart',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SparepartResponse'
              }
            }
          }
        },
        404: {
          description: 'Sparepart not found',
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
      tags: ['Spareparts'],
      summary: 'Update sparepart',
      description: 'Update an existing sparepart',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Sparepart ID',
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
              $ref: '#/components/schemas/SparepartInput'
            },
            example: {
              target_id: 'T001',
              part_number: 'PN-12345',
              sparepart_name_en: 'Engine Oil Filter',
              sparepart_name_ch: '机油滤清器',
              description: 'High quality engine oil filter',
              quantity: 3,
              unit: 'pcs'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated sparepart',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SparepartResponse'
              }
            }
          }
        },
        404: {
          description: 'Sparepart not found',
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
      tags: ['Spareparts'],
      summary: 'Delete sparepart',
      description: 'Soft delete a sparepart',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Sparepart ID',
          schema: {
            type: 'string',
            format: 'uuid'
          }
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted sparepart',
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
          description: 'Sparepart not found',
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

module.exports = sparepartsPaths;

