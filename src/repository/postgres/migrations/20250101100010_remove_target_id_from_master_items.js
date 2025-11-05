/**
 * Migration: Remove target_id column from master_items table
 * The target_id is now stored in item_categories_details table instead
 */

exports.up = function(knex) {
  return knex.schema.table('master_items', (table) => {
    // Drop index for target_id if exists
    table.dropIndex(['target_id'], 'idx_master_items_target_id');
    
    // Drop column
    table.dropColumn('target_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('master_items', (table) => {
    // Recreate column
    table.string('target_id', 255).nullable();
    
    // Recreate index
    table.index(['target_id'], 'idx_master_items_target_id');
  });
};

