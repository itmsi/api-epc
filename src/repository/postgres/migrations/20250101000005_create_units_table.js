/**
 * Migration: Create units table
 * Table untuk menyimpan data units
 */

exports.up = function(knex) {
  return knex.schema.createTable('units', (table) => {
    // Primary Key dengan UUID
    table.uuid('unit_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Data fields sesuai spesifikasi
    table.string('unit_name_en', 255).nullable();
    table.string('unit_name_cn', 255).nullable();
    table.text('unit_description').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes untuk performa query yang lebih baik
    table.index(['deleted_at'], 'idx_units_deleted_at');
    table.index(['is_delete'], 'idx_units_is_delete');
    table.index(['created_at'], 'idx_units_created_at');
    table.index(['unit_name_en'], 'idx_units_name_en');
    table.index(['unit_name_cn'], 'idx_units_name_cn');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('units');
};

