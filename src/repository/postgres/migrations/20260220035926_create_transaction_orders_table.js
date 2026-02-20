/**
 * Migration: Create transaction_orders table
 */

exports.up = function (knex) {
    return knex.schema.createTable('transaction_orders', (table) => {
        // Primary Key dengan UUID
        table.uuid('transaction_order_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

        // Auto incrementing order number
        table.specificType('transaction_order_no', 'serial').unique().index('idx_transaction_orders_no');

        // Data fields
        table.uuid('customer_id').nullable();
        table.date('transaction_order_date').nullable();
        table.string('transaction_order_status', 255).nullable();
        table.jsonb('transaction_order_items').nullable();
        table.integer('transaction_order_items_total').defaultTo(0);
        table.text('transaction_order_description').nullable();

        // Audit fields
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.uuid('created_by').nullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.uuid('updated_by').nullable();
        table.timestamp('deleted_at').nullable();
        table.uuid('deleted_by').nullable();
        table.boolean('is_delete').defaultTo(false);

        // Indexes
        table.index(['deleted_at'], 'idx_transaction_orders_deleted_at');
        table.index(['is_delete'], 'idx_transaction_orders_is_delete');
        table.index(['created_at'], 'idx_transaction_orders_created_at');
        table.index(['customer_id'], 'idx_transaction_orders_customer_id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('transaction_orders');
};
