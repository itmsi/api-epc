/**
 * Migration: Rename sparepart_id to master_item_id in item_categories_details table
 */

exports.up = function(knex) {
  return knex.schema.table('item_categories_details', (table) => {
    // Drop existing foreign key constraint
    table.dropForeign('sparepart_id');
    
    // Drop existing index
    table.dropIndex(['sparepart_id'], 'idx_item_categories_details_sparepart_id');
    
    // Rename column
    table.renameColumn('sparepart_id', 'master_item_id');
    
    // Recreate foreign key constraint with new column name
    table.foreign('master_item_id').references('master_item_id').inTable('master_items').onDelete('SET NULL');
    
    // Recreate index with new column name
    table.index(['master_item_id'], 'idx_item_categories_details_master_item_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('item_categories_details', (table) => {
    // Drop foreign key constraint
    table.dropForeign('master_item_id');
    
    // Drop index
    table.dropIndex(['master_item_id'], 'idx_item_categories_details_master_item_id');
    
    // Rename column back
    table.renameColumn('master_item_id', 'sparepart_id');
    
    // Recreate foreign key constraint
    table.foreign('sparepart_id').references('sparepart_id').inTable('spareparts').onDelete('SET NULL');
    
    // Recreate index
    table.index(['sparepart_id'], 'idx_item_categories_details_sparepart_id');
  });
};

