const db = require('../../config/database').pgCore;

const TABLE_NAME = 'dokumen';

/**
 * Find all documents with pagination
 */
const findAll = async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit;
  
  let query = db(TABLE_NAME + ' as d')
    .select(
      'd.*',
      db.raw(`concat_ws(' - ', d.dokumen_name, c.category_name_en, tc.type_category_name_en) as dokumen_name_all`)
    )
    .leftJoin('item_categories as ic', function() {
      this.on('d.dokumen_id', '=', 'ic.dokumen_id')
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', db.raw('false'));
    })
    .leftJoin('type_categories as tc', function() {
      this.on('tc.type_category_id', '=', 'ic.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', db.raw('false'));
    })
    .leftJoin('categories as c', function() {
      this.on('c.category_id', '=', 'tc.category_id')
        .andOnNull('c.deleted_at')
        .andOn('c.is_delete', '=', db.raw('false'));
    })
    .leftJoin('master_categories as mc', function() {
      this.on('mc.master_category_id', '=', 'c.master_category_id')
        .andOnNull('mc.deleted_at')
        .andOn('mc.is_delete', '=', db.raw('false'));
    })
    .where('d.deleted_at', null)
    .where('d.is_delete', false)
    .groupBy('d.dokumen_id', 'd.dokumen_name', 'd.dokumen_description', 'd.created_at', 'd.created_by', 'd.updated_at', 'd.updated_by', 'd.deleted_at', 'd.deleted_by', 'd.is_delete', 'tc.type_category_id', 'c.category_id');

  // Add search functionality
  if (search) {
    query = query.where(function() {
      this.where('d.dokumen_name', 'ilike', `%${search}%`)
        .orWhere('d.dokumen_description', 'ilike', `%${search}%`);
    });
  }

  // Add sorting - ensure we use qualified column names
  const sortColumn = sortBy.includes('.') ? sortBy : `d.${sortBy}`;
  query = query.orderBy(sortColumn, sortOrder);

  const data = await query.limit(limit).offset(offset);
  
  // Get total count - replicate query structure without pagination
  let countQuery = db(TABLE_NAME + ' as d')
    .select(db.raw('1'))
    .leftJoin('item_categories as ic', function() {
      this.on('ic.dokumen_id', '=', 'd.dokumen_id')
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', db.raw('false'));
    })
    .leftJoin('type_categories as tc', function() {
      this.on('tc.type_category_id', '=', 'ic.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', db.raw('false'));
    })
    .leftJoin('categories as c', function() {
      this.on('c.category_id', '=', 'tc.category_id')
        .andOnNull('c.deleted_at')
        .andOn('c.is_delete', '=', db.raw('false'));
    })
    .leftJoin('master_categories as mc', function() {
      this.on('mc.master_category_id', '=', 'c.master_category_id')
        .andOnNull('mc.deleted_at')
        .andOn('mc.is_delete', '=', db.raw('false'));
    })
    .where('d.deleted_at', null)
    .where('d.is_delete', false);

  if (search) {
    countQuery = countQuery.where(function() {
      this.where('d.dokumen_name', 'ilike', `%${search}%`)
        .orWhere('d.dokumen_description', 'ilike', `%${search}%`);
    });
  }

  // Apply GROUP BY and count rows
  countQuery = countQuery.groupBy('tc.type_category_id', 'c.category_id', 'd.dokumen_id');
  const countRows = await countQuery;
  const total = { count: countRows.length };
  
  return {
    items: data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total.count),
      totalPages: Math.ceil(total.count / limit)
    }
  };
};

/**
 * Find single document by ID
 */
const findById = async (id) => {
  return await db(TABLE_NAME)
    .where('dokumen_id', id)
    .where('deleted_at', null)
    .where('is_delete', false)
    .first();
};

/**
 * Create new document
 */
const create = async (data, userId) => {
  const [result] = await db(TABLE_NAME)
    .insert({
      dokumen_name: data.dokumen_name,
      dokumen_description: data.dokumen_description,
      created_by: userId,
      updated_by: userId,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Update existing document
 */
const update = async (id, data, userId) => {
  const [result] = await db(TABLE_NAME)
    .where('dokumen_id', id)
    .where('deleted_at', null)
    .where('is_delete', false)
    .update({
      dokumen_name: data.dokumen_name,
      dokumen_description: data.dokumen_description,
      updated_by: userId,
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Soft delete document
 */
const remove = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where('dokumen_id', id)
    .where('deleted_at', null)
    .where('is_delete', false)
    .update({
      deleted_at: db.fn.now(),
      deleted_by: userId,
      is_delete: true,
      updated_at: db.fn.now(),
      updated_by: userId
    })
    .returning('*');
  return result;
};

/**
 * Restore soft deleted document
 */
const restore = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where('dokumen_id', id)
    .whereNotNull('deleted_at')
    .where('is_delete', true)
    .update({
      deleted_at: null,
      deleted_by: null,
      is_delete: false,
      updated_at: db.fn.now(),
      updated_by: userId
    })
    .returning('*');
  return result;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  restore
};

