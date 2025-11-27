/**
 * Migration: Add model_type, dimensi, model_engine fields to products table
 */

exports.up = function(knex) {
  return knex.schema.table('products', (table) => {
    table.string('model_type', 255).nullable();
    table.string('dimensi', 255).nullable();
    table.string('model_engine', 255).nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('products', (table) => {
    table.dropColumn('model_type');
    table.dropColumn('dimensi');
    table.dropColumn('model_engine');
  });
};

