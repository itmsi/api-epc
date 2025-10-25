/**
 * Swagger Path Definitions for Unit Module
 */

const unitPaths = {
  '/unit/get': {
    post: {
      tags: ['Units'],
      summary: 'Get all units with pagination and filter',
      description: 'Retrieve units with pagination, search, and sorting capabilities',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnitFilter'
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
          description: 'Successfully retrieved units',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnitListResponse'
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
  '/unit/{id}': {
    get: {
      tags: ['Units'],
      summary: 'Get unit by ID',
      description: 'Retrieve a specific unit by its ID',
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
          description: 'Unit ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully retrieved unit',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnitResponse'
              }
            }
          }
        },
        404: {
          description: 'Unit not found',
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
      tags: ['Units'],
      summary: 'Update unit',
      description: 'Update an existing unit',
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
          description: 'Unit ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnitInput'
            },
            example: {
              unit_name_en: 'Updated Kilogram',
              unit_name_cn: '更新的千克',
              unit_description: 'Updated unit of mass'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Successfully updated unit',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnitResponse'
              }
            }
          }
        },
        404: {
          description: 'Unit not found',
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
      tags: ['Units'],
      summary: 'Delete unit (soft delete)',
      description: 'Soft delete a unit',
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
          description: 'Unit ID',
          example: '123e4567-e89b-12d3-a456-426614174000'
        }
      ],
      responses: {
        200: {
          description: 'Successfully deleted unit',
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
                    example: 'Unit berhasil dihapus'
                  }
                }
              }
            }
          }
        },
        404: {
          description: 'Unit not found',
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
  '/unit/create': {
    post: {
      tags: ['Units'],
      summary: 'Create new unit',
      description: 'Create a new unit',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UnitInput'
            },
            example: {
              unit_name_en: 'Kilogram',
              unit_name_cn: '千克',
              unit_description: 'Unit of mass'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Successfully created unit',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnitResponse'
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

module.exports = unitPaths;

