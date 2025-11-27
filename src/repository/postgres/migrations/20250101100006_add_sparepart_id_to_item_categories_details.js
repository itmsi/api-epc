/**
 * Migration: Add sparepart_id column to item_categories_details table
 */

exports.up = function(knex) {
  return knex.schema.table('item_categories_details', (table) => {
    // Add sparepart_id column
    table.uuid('sparepart_id').nullable().after('item_category_id');
    
    // Add foreign key constraint
    table.foreign('sparepart_id').references('sparepart_id').inTable('spareparts').onDelete('SET NULL');
    
    // Add index for better query performance
    table.index(['sparepart_id'], 'idx_item_categories_details_sparepart_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('item_categories_details', (table) => {
    // Drop index
    table.dropIndex(['sparepart_id'], 'idx_item_categories_details_sparepart_id');
    
    // Drop foreign key constraint
    table.dropForeign('sparepart_id');
    
    // Drop column
    table.dropColumn('sparepart_id');
  });
};

