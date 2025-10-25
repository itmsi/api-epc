/**
 * Migration: Create master_categories table
 * Table untuk menyimpan data master kategori
 */

exports.up = function(knex) {
  return knex.schema.createTable('master_categories', (table) => {
    // Primary Key dengan UUID
    table.uuid('master_category_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Data fields sesuai spesifikasi
    table.string('master_category_name_en', 255).nullable();
    table.string('master_category_name_cn', 255).nullable();
    table.text('master_category_description').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes untuk performa query yang lebih baik
    table.index(['deleted_at'], 'idx_master_categories_deleted_at');
    table.index(['is_delete'], 'idx_master_categories_is_delete');
    table.index(['created_at'], 'idx_master_categories_created_at');
    table.index(['master_category_name_en'], 'idx_master_categories_name_en');
    table.index(['master_category_name_cn'], 'idx_master_categories_name_cn');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('master_categories');
};
