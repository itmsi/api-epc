/**
 * Migration: Add category_id column to item_categories table
 */

exports.up = function(knex) {
  return knex.schema.table('item_categories', (table) => {
    // Add category_id column
    table.uuid('category_id').nullable().after('type_category_id');
    
    // Add foreign key constraint
    table.foreign('category_id').references('category_id').inTable('categories').onDelete('SET NULL');
    
    // Add index for better query performance
    table.index(['category_id'], 'idx_item_categories_category_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('item_categories', (table) => {
    // Drop index
    table.dropIndex(['category_id'], 'idx_item_categories_category_id');
    
    // Drop foreign key constraint
    table.dropForeign('category_id');
    
    // Drop column
    table.dropColumn('category_id');
  });
};

