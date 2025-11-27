/**
 * Migration: Remove columns from item_categories_details table
 * Removes: part_number, catalog_item_name_en, catalog_item_name_ch, description, unit
 * These columns are now referenced from master_items table via master_item_id foreign key
 */

exports.up = function(knex) {
  return knex.schema.table('item_categories_details', (table) => {
    // Drop index for part_number if exists
    table.dropIndex(['part_number'], 'idx_item_categories_details_part_number');
    
    // Drop columns
    table.dropColumn('part_number');
    table.dropColumn('catalog_item_name_en');
    table.dropColumn('catalog_item_name_ch');
    table.dropColumn('description');
    table.dropColumn('unit');
  });
};

exports.down = function(knex) {
  return knex.schema.table('item_categories_details', (table) => {
    // Recreate columns
    table.string('part_number', 255).nullable();
    table.string('catalog_item_name_en', 255).nullable();
    table.string('catalog_item_name_ch', 255).nullable();
    table.text('description').nullable();
    table.string('unit', 255).nullable();
    
    // Recreate index
    table.index(['part_number'], 'idx_item_categories_details_part_number');
  });
};

