const transactionOrderSchema = {
    TransactionOrderFilter: {
        type: 'object',
        properties: {
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
            search: {
                type: 'string',
                default: ''
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

    TransactionOrderInput: {
        type: 'object',
        required: ['customer_id'],
        properties: {
            customer_id: {
                type: 'string',
                format: 'uuid'
            },
            transaction_order_no: {
                type: 'string'
            },
            transaction_order_date: {
                type: 'string',
                format: 'date'
            },
            transaction_order_status: {
                type: 'string'
            },
            transaction_order_items: {
                type: 'object'
            },
            transaction_order_items_total: {
                type: 'integer',
                default: 0
            },
            transaction_order_description: {
                type: 'string'
            }
        }
    },

    TransactionOrderBase: {
        type: 'object',
        properties: {
            transaction_order_id: {
                type: 'string',
                format: 'uuid'
            },
            customer_id: {
                type: 'string',
                format: 'uuid'
            },
            transaction_order_no: {
                type: 'string'
            },
            transaction_order_date: {
                type: 'string',
                format: 'date-time'
            },
            transaction_order_status: {
                type: 'string'
            },
            transaction_order_items: {
                type: 'object'
            },
            transaction_order_items_total: {
                type: 'integer'
            },
            transaction_order_description: {
                type: 'string'
            },
            created_at: {
                type: 'string',
                format: 'date-time'
            },
            created_by: {
                type: 'string',
                format: 'uuid',
                nullable: true
            },
            updated_at: {
                type: 'string',
                format: 'date-time'
            },
            updated_by: {
                type: 'string',
                format: 'uuid',
                nullable: true
            },
            deleted_at: {
                type: 'string',
                format: 'date-time',
                nullable: true
            },
            deleted_by: {
                type: 'string',
                format: 'uuid',
                nullable: true
            },
            is_delete: {
                type: 'boolean'
            }
        }
    },

    TransactionOrderResponse: {
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
                $ref: '#/components/schemas/TransactionOrderBase'
            }
        }
    },

    TransactionOrderListResponse: {
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
                    items: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/TransactionOrderBase'
                        }
                    },
                    pagination: {
                        $ref: '#/components/schemas/Pagination'
                    }
                }
            }
        }
    }
};

module.exports = transactionOrderSchema;
