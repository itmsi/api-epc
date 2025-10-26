/**
 * Migration: Create products_details table
 */

exports.up = function(knex) {
  return knex.schema.createTable('products_details', (table) => {
    // Primary Key with UUID
    table.uuid('product_detail_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Foreign Keys
    table.uuid('product_id').notNullable();
    table.uuid('dokumen_id').nullable();
    
    // Data fields
    table.string('product_detail_name_en', 255).nullable();
    table.string('product_detail_name_cn', 255).nullable();
    table.text('product_detail_description').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Foreign key constraints
    table.foreign('product_id').references('product_id').inTable('products').onDelete('CASCADE');
    table.foreign('dokumen_id').references('dokumen_id').inTable('dokumen').onDelete('SET NULL');
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_products_details_deleted_at');
    table.index(['is_delete'], 'idx_products_details_is_delete');
    table.index(['created_at'], 'idx_products_details_created_at');
    table.index(['product_id'], 'idx_products_details_product_id');
    table.index(['dokumen_id'], 'idx_products_details_dokumen_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products_details');
};

