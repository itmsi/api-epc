/**
 * Migration: Add categories_code column to categories table
 */

exports.up = function(knex) {
  return knex.schema.table('categories', (table) => {
    // Add categories_code column (nullable, string)
    table.string('categories_code', 255).nullable();
    
    // Add index for better query performance
    table.index(['categories_code'], 'idx_categories_categories_code');
  });
};

exports.down = function(knex) {
  return knex.schema.table('categories', (table) => {
    // Drop index
    table.dropIndex(['categories_code'], 'idx_categories_categories_code');
    
    // Drop column
    table.dropColumn('categories_code');
  });
};

