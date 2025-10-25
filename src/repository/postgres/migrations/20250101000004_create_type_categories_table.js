/**
 * Migration: Create type_categories table
 * Table untuk menyimpan data type categories
 */

exports.up = function(knex) {
  return knex.schema.createTable('type_categories', (table) => {
    // Primary Key dengan UUID
    table.uuid('type_category_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Foreign Key ke categories
    table.uuid('category_id').nullable();
    
    // Data fields sesuai spesifikasi
    table.string('type_category_name_en', 255).nullable();
    table.string('type_category_name_cn', 255).nullable();
    table.text('type_category_description').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes untuk performa query yang lebih baik
    table.index(['deleted_at'], 'idx_type_categories_deleted_at');
    table.index(['is_delete'], 'idx_type_categories_is_delete');
    table.index(['created_at'], 'idx_type_categories_created_at');
    table.index(['category_id'], 'idx_type_categories_category_id');
    table.index(['type_category_name_en'], 'idx_type_categories_name_en');
    table.index(['type_category_name_cn'], 'idx_type_categories_name_cn');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('type_categories');
};
