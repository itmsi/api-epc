/**
 * Migration: Create dokumen table
 */

exports.up = function(knex) {
  return knex.schema.createTable('dokumen', (table) => {
    // Primary Key with UUID
    table.uuid('dokumen_id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    
    // Data fields
    table.string('dokumen_name', 255).nullable();
    table.text('dokumen_description').nullable();
    
    // Audit fields
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.uuid('created_by').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.uuid('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('deleted_by').nullable();
    table.boolean('is_delete').defaultTo(false);
    
    // Indexes for better query performance
    table.index(['deleted_at'], 'idx_dokumen_deleted_at');
    table.index(['is_delete'], 'idx_dokumen_is_delete');
    table.index(['created_at'], 'idx_dokumen_created_at');
    table.index(['dokumen_name'], 'idx_dokumen_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('dokumen');
};
