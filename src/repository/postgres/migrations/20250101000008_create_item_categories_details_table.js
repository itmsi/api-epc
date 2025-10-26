/**
 * Migration: Create item_categories_details table
 */

exports.up = function(knex) {
  return knex.schema.createTable('item_categories_details', (table) => {
    // Primary Key with UUID
    table.uuid('item_category_detail_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Foreign Keys
    table.uuid('item_category_id').nullable();
    
    // Data fields
    table.string('target_id', 255).nullable();
    table.string('part_number', 255).nullable();
    table.string('catalog_item_name_en', 255).nullable();
    table.string('catalog_item_name_ch', 255).nullable();
    table.text('description').nullable();
    table.integer('quantity').nullable();
    table.string('unit', 255).nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Foreign key constraints
    table.foreign('item_category_id').references('item_category_id').inTable('item_categories').onDelete('CASCADE');
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_item_categories_details_deleted_at');
    table.index(['is_delete'], 'idx_item_categories_details_is_delete');
    table.index(['created_at'], 'idx_item_categories_details_created_at');
    table.index(['item_category_id'], 'idx_item_categories_details_item_category_id');
    table.index(['target_id'], 'idx_item_categories_details_target_id');
    table.index(['part_number'], 'idx_item_categories_details_part_number');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('item_categories_details');
};
