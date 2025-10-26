/**
 * Migration: Create categories table
 * Table untuk menyimpan data categories
 */

exports.up = function(knex) {
  return knex.schema.createTable('categories', (table) => {
    // Primary Key dengan UUID
    table.uuid('category_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Foreign Key ke master_categories
    table.uuid('master_category_id').nullable();
    table.string('master_category_name_en', 255).nullable();
    
    // Data fields sesuai spesifikasi
    table.string('category_name_en', 255).nullable();
    table.string('category_name_cn', 255).nullable();
    table.text('category_description').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes untuk performa query yang lebih baik
    table.index(['deleted_at'], 'idx_categories_deleted_at');
    table.index(['is_delete'], 'idx_categories_is_delete');
    table.index(['created_at'], 'idx_categories_created_at');
    table.index(['master_category_id'], 'idx_categories_master_category_id');
    table.index(['master_category_name_en'], 'idx_categories_master_category_name_en');
    table.index(['category_name_en'], 'idx_categories_name_en');
    table.index(['category_name_cn'], 'idx_categories_name_cn');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('categories');
};

