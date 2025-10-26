/**
 * Migration: Create products table
 */

exports.up = function(knex) {
  return knex.schema.createTable('products', (table) => {
    // Primary Key with UUID
    table.uuid('product_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Data fields
    table.string('product_name_en', 255).nullable();
    table.string('product_name_cn', 255).nullable();
    table.text('product_description').nullable();
    table.string('vin_number', 255).nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_products_deleted_at');
    table.index(['is_delete'], 'idx_products_is_delete');
    table.index(['created_at'], 'idx_products_created_at');
    table.index(['vin_number'], 'idx_products_vin_number');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};

