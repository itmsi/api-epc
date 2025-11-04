/**
 * Migration: Create spareparts table
 */

exports.up = function(knex) {
  return knex.schema.createTable('spareparts', (table) => {
    // Primary Key with UUID
    table.uuid('sparepart_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Data fields
    table.string('target_id', 255).nullable();
    table.string('part_number', 255).nullable();
    table.string('sparepart_name_en', 255).nullable();
    table.string('sparepart_name_ch', 255).nullable();
    table.text('description').nullable();
    table.integer('quantity').defaultTo(0);
    table.string('unit', 255).nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_spareparts_deleted_at');
    table.index(['is_delete'], 'idx_spareparts_is_delete');
    table.index(['created_at'], 'idx_spareparts_created_at');
    table.index(['part_number'], 'idx_spareparts_part_number');
    table.index(['target_id'], 'idx_spareparts_target_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('spareparts');
};

