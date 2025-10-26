/**
 * Migration: Add category_name_en column to categories table
 */

exports.up = function(knex) {
  return knex.schema.table('categories', (table) => {
    table.string('category_name_en', 255).nullable().after('master_category_name_en');
    table.index(['category_name_en'], 'idx_categories_name_en');
  });
};

exports.down = function(knex) {
  return knex.schema.table('categories', (table) => {
    table.dropIndex('idx_categories_name_en');
    table.dropColumn('category_name_en');
  });
};

