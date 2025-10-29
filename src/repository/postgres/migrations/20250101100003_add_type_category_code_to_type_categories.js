/**
 * Migration: Add type_category_code column to type_categories table
 */

exports.up = function(knex) {
  return knex.schema.table('type_categories', (table) => {
    // Add type_category_code column (nullable, string)
    table.string('type_category_code', 255).nullable();
    
    // Add index for better query performance
    table.index(['type_category_code'], 'idx_type_categories_type_category_code');
  });
};

exports.down = function(knex) {
  return knex.schema.table('type_categories', (table) => {
    // Drop index
    table.dropIndex(['type_category_code'], 'idx_type_categories_type_category_code');
    
    // Drop column
    table.dropColumn('type_category_code');
  });
};

