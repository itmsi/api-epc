/**
 * Migration: Create item_categories table
 */

exports.up = function(knex) {
  return knex.schema.createTable('item_categories', (table) => {
    // Primary Key with UUID
    table.uuid('item_category_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Foreign Keys
    table.uuid('type_category_id').nullable();
    table.uuid('dokumen_id').nullable();
    
    // Data fields
    table.string('item_category_name_en', 255).nullable();
    table.string('item_category_name_cn', 255).nullable();
    table.text('item_category_description').nullable();
    table.text('item_category_foto').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Foreign key constraints
    table.foreign('type_category_id').references('type_category_id').inTable('type_categories').onDelete('SET NULL');
    table.foreign('dokumen_id').references('dokumen_id').inTable('dokumen').onDelete('SET NULL');
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_item_categories_deleted_at');
    table.index(['is_delete'], 'idx_item_categories_is_delete');
    table.index(['created_at'], 'idx_item_categories_created_at');
    table.index(['type_category_id'], 'idx_item_categories_type_category_id');
    table.index(['dokumen_id'], 'idx_item_categories_dokumen_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('item_categories');
};
