/**
 * Migration: Add status to products table
 */

exports.up = function (knex) {
    return knex.schema.alterTable('products', (table) => {
        table.string('status', 255).nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('products', (table) => {
        table.dropColumn('status');
    });
};
