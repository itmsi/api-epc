/**
 * Migration: Create vin_customer table
 * Purpose: Store customer-product relationships (many-to-many)
 */

exports.up = function(knex) {
  return knex.schema.createTable('vin_customer', (table) => {
    // Primary Key with UUID
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Foreign Keys
    table.uuid('customer_id').notNullable().comment('Customer ID from API SSO');
    table.uuid('product_id').notNullable().comment('Product ID from products table');
    
    // Foreign key constraint to products table
    table.foreign('product_id')
      .references('product_id')
      .inTable('products')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes for better query performance
    table.index(['customer_id'], 'idx_vin_customer_customer_id');
    table.index(['product_id'], 'idx_vin_customer_product_id');
    table.index(['deleted_at'], 'idx_vin_customer_deleted_at');
    table.index(['is_delete'], 'idx_vin_customer_is_delete');
    table.index(['created_at'], 'idx_vin_customer_created_at');
  }).then(() => {
    // Partial Unique Index to prevent duplicate assignments while active
    // This allows multiple soft-deleted records for the same assignment
    return knex.raw(`
      CREATE UNIQUE INDEX uq_vin_customer_active_assignment 
      ON vin_customer (customer_id, product_id) 
      WHERE (deleted_at IS NULL)
    `);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('vin_customer');
};
