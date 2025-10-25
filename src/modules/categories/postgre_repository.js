const db = require('../../config/database').pgCore;

const TABLE_NAME = 'categories';

/**
 * Find all items with pagination dan search
 */
const findAll = async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit;
  
  let query = db(TABLE_NAME)
    .select('*')
    .where({ is_delete: false });
  
  // Search functionality
  if (search) {
    query = query.where(function() {
      this.where('master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('category_name_cn', 'ilike', `%${search}%`)
        .orWhere('category_description', 'ilike', `%${search}%`);
    });
  }
  
  // Sorting
  query = query.orderBy(sortBy, sortOrder);
  
  const data = await query
    .limit(limit)
    .offset(offset);
    
  // Count total untuk pagination
  let countQuery = db(TABLE_NAME)
    .where({ is_delete: false });
    
  if (search) {
    countQuery = countQuery.where(function() {
      this.where('master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('category_name_cn', 'ilike', `%${search}%`)
        .orWhere('category_description', 'ilike', `%${search}%`);
    });
  }
  
  const total = await countQuery
    .count('category_id as count')
    .first();
    
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
 * Find single item by ID
 */
const findById = async (id) => {
  return await db(TABLE_NAME)
    .where({ category_id: id, is_delete: false })
    .first();
};

/**
 * Find by custom condition
 */
const findOne = async (conditions) => {
  return await db(TABLE_NAME)
    .where({ ...conditions, is_delete: false })
    .first();
};

/**
 * Create new item
 */
const create = async (data, userId) => {
  const [result] = await db(TABLE_NAME)
    .insert({
      ...data,
      created_by: userId,
      updated_by: userId,
      created_at: db.raw('now()'),
      updated_at: db.raw('now()')
    })
    .returning('*');
  return result;
};

/**
 * Update existing item
 */
const update = async (id, data, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ category_id: id, is_delete: false })
    .update({
      ...data,
      updated_by: userId,
      updated_at: db.raw('now()')
    })
    .returning('*');
  return result;
};

/**
 * Soft delete item
 */
const remove = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ category_id: id, is_delete: false })
    .update({
      is_delete: true,
      deleted_at: db.raw('now()'),
      deleted_by: userId,
      updated_at: db.raw('now()'),
      updated_by: userId
    })
    .returning('*');
  return result;
};

/**
 * Restore soft deleted item
 */
const restore = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ category_id: id })
    .where({ is_delete: true })
    .update({
      is_delete: false,
      deleted_at: null,
      deleted_by: null,
      updated_at: db.raw('now()'),
      updated_by: userId
    })
    .returning('*');
  return result;
};

/**
 * Hard delete item (permanent)
 */
const hardDelete = async (id) => {
  return await db(TABLE_NAME)
    .where({ category_id: id })
    .del();
};

module.exports = {
  findAll,
  findById,
  findOne,
  create,
  update,
  remove,
  restore,
  hardDelete
};

