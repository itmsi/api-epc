/**
 * Swagger Path Definitions for Transaction Order Module
 */

const transactionOrderPaths = {
    '/transaction_order/get': {
        post: {
            tags: ['Transaction Order'],
            summary: 'Get all transaction orders with pagination and filter',
            description: 'Retrieve transaction orders with pagination, search, and sorting capabilities',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/TransactionOrderFilter'
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
                    description: 'Successfully retrieved transaction orders',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TransactionOrderListResponse'
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
    '/transaction_order/{id}': {
        get: {
            tags: ['Transaction Order'],
            summary: 'Get transaction order by ID',
            description: 'Retrieve a specific transaction order by its ID',
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
                    description: 'Transaction order ID',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                }
            ],
            responses: {
                200: {
                    description: 'Successfully retrieved transaction order',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TransactionOrderResponse'
                            }
                        }
                    }
                },
                404: {
                    description: 'Transaction order not found',
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
            tags: ['Transaction Order'],
            summary: 'Update transaction order',
            description: 'Update an existing transaction order',
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
                    description: 'Transaction order ID',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/TransactionOrderInput'
                        },
                        example: {
                            customer_id: "69fdc48b-fbe3-455a-8cc1-a1c52cd4e500",
                            transaction_order_date: "2026-02-20",
                            transaction_order_status: "string",
                            transaction_order_items: {
                                data: [
                                    {
                                        vin_number: "",
                                        item: [
                                            {
                                                master_item_id: "",
                                                part_number: "",
                                                master_item_name_en: "",
                                                master_item_name_ch: "",
                                                quantity_needs: "",
                                                quantity_order: ""
                                            }
                                        ]
                                    },
                                    {
                                        vin_number: "",
                                        item: [
                                            {
                                                master_item_id: "",
                                                part_number: "",
                                                master_item_name_en: "",
                                                master_item_name_ch: "",
                                                quantity_needs: "",
                                                quantity_order: ""
                                            }
                                        ]
                                    }
                                ]
                            },
                            transaction_order_items_total: 30
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Successfully updated transaction order',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TransactionOrderResponse'
                            }
                        }
                    }
                },
                404: {
                    description: 'Transaction order not found',
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
            tags: ['Transaction Order'],
            summary: 'Delete transaction order (soft delete)',
            description: 'Soft delete a transaction order',
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
                    description: 'Transaction order ID',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                }
            ],
            responses: {
                200: {
                    description: 'Successfully deleted transaction order',
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
                    description: 'Transaction order not found',
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
    '/transaction_order/create': {
        post: {
            tags: ['Transaction Order'],
            summary: 'Create new transaction order',
            description: 'Create a new transaction order',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/TransactionOrderInput'
                        },
                        example: {
                            customer_id: "69fdc48b-fbe3-455a-8cc1-a1c52cd4e500",
                            transaction_order_date: "2026-02-20",
                            transaction_order_status: "string",
                            transaction_order_items: {
                                data: [
                                    {
                                        vin_number: "",
                                        item: [
                                            {
                                                master_item_id: "",
                                                part_number: "",
                                                master_item_name_en: "",
                                                master_item_name_ch: "",
                                                quantity_needs: "",
                                                quantity_order: ""
                                            }
                                        ]
                                    },
                                    {
                                        vin_number: "",
                                        item: [
                                            {
                                                master_item_id: "",
                                                part_number: "",
                                                master_item_name_en: "",
                                                master_item_name_ch: "",
                                                quantity_needs: "",
                                                quantity_order: ""
                                            }
                                        ]
                                    }
                                ]
                            },
                            transaction_order_items_total: 30
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Successfully created transaction order',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/TransactionOrderResponse'
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

module.exports = transactionOrderPaths;
