const db = require('../../config/database').pgCore;

const TABLE_NAME = 'dokumen';

/**
 * Find all documents with pagination
 */
const findAll = async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit;
  
  let query = db(TABLE_NAME)
    .select('*')
    .where('deleted_at', null)
    .where('is_delete', false);

  // Add search functionality
  if (search) {
    query = query.where(function() {
      this.where('dokumen_name', 'ilike', `%${search}%`)
        .orWhere('dokumen_description', 'ilike', `%${search}%`);
    });
  }

  // Add sorting
  query = query.orderBy(sortBy, sortOrder);

  const data = await query.limit(limit).offset(offset);
  
  // Get total count
  let countQuery = db(TABLE_NAME)
    .where('deleted_at', null)
    .where('is_delete', false);

  if (search) {
    countQuery = countQuery.where(function() {
      this.where('dokumen_name', 'ilike', `%${search}%`)
        .orWhere('dokumen_description', 'ilike', `%${search}%`);
    });
  }

  const total = await countQuery.count('dokumen_id as count').first();
  
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

