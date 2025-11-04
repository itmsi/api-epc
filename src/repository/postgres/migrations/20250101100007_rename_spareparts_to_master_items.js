/**
 * Migration: Rename table spareparts to master_items and sparepart_id to master_item_id
 */

exports.up = function(knex) {
  return knex.schema
    .alterTable('spareparts', (table) => {
      // Rename primary key column
      table.renameColumn('sparepart_id', 'master_item_id');
      
      // Rename name columns
      table.renameColumn('sparepart_name_en', 'master_item_name_en');
      table.renameColumn('sparepart_name_ch', 'master_item_name_ch');
    })
    .then(() => {
      // Rename indexes
      return knex.raw(`
        ALTER INDEX idx_spareparts_deleted_at RENAME TO idx_master_items_deleted_at;
        ALTER INDEX idx_spareparts_is_delete RENAME TO idx_master_items_is_delete;
        ALTER INDEX idx_spareparts_created_at RENAME TO idx_master_items_created_at;
        ALTER INDEX idx_spareparts_part_number RENAME TO idx_master_items_part_number;
        ALTER INDEX idx_spareparts_target_id RENAME TO idx_master_items_target_id;
      `);
    })
    .then(() => {
      // Rename table
      return knex.schema.renameTable('spareparts', 'master_items');
    });
};

exports.down = function(knex) {
  return knex.schema
    .renameTable('master_items', 'spareparts')
    .then(() => {
      return knex.raw(`
        ALTER INDEX idx_master_items_deleted_at RENAME TO idx_spareparts_deleted_at;
        ALTER INDEX idx_master_items_is_delete RENAME TO idx_spareparts_is_delete;
        ALTER INDEX idx_master_items_created_at RENAME TO idx_spareparts_created_at;
        ALTER INDEX idx_master_items_part_number RENAME TO idx_spareparts_part_number;
        ALTER INDEX idx_master_items_target_id RENAME TO idx_spareparts_target_id;
      `);
    })
    .then(() => {
      return knex.schema.alterTable('spareparts', (table) => {
        table.renameColumn('master_item_id', 'sparepart_id');
        table.renameColumn('master_item_name_en', 'sparepart_name_en');
        table.renameColumn('master_item_name_ch', 'sparepart_name_ch');
      });
    });
};

