const db = require('../../config/database').pgCore;

const TABLE_NAME = 'spareparts';

/**
 * Find all spareparts with pagination and search
 */
const findAll = async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit;
  
  let query = db(TABLE_NAME)
    .select('*')
    .where({ is_delete: false });
  
  // Search functionality
  if (search) {
    query = query.where(function() {
      this.where('target_id', 'ilike', `%${search}%`)
        .orWhere('part_number', 'ilike', `%${search}%`)
        .orWhere('sparepart_name_en', 'ilike', `%${search}%`)
        .orWhere('sparepart_name_ch', 'ilike', `%${search}%`)
        .orWhere('description', 'ilike', `%${search}%`)
        .orWhere('unit', 'ilike', `%${search}%`);
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
      this.where('target_id', 'ilike', `%${search}%`)
        .orWhere('part_number', 'ilike', `%${search}%`)
        .orWhere('sparepart_name_en', 'ilike', `%${search}%`)
        .orWhere('sparepart_name_ch', 'ilike', `%${search}%`)
        .orWhere('description', 'ilike', `%${search}%`)
        .orWhere('unit', 'ilike', `%${search}%`);
    });
  }
  
  const total = await countQuery
    .count('sparepart_id as count')
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
 * Find single sparepart by ID
 */
const findById = async (id) => {
  return await db(TABLE_NAME)
    .where({ sparepart_id: id, is_delete: false })
    .first();
};

/**
 * Create new sparepart
 */
const create = async (data, userId) => {
  const [result] = await db(TABLE_NAME)
    .insert({
      ...data,
      created_by: userId,
      updated_by: userId,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Update existing sparepart
 */
const update = async (id, data, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ sparepart_id: id, is_delete: false })
    .update({
      ...data,
      updated_by: userId,
      updated_at: db.fn.now()
    })
    .returning('*');
  return result;
};

/**
 * Soft delete sparepart
 */
const remove = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ sparepart_id: id, is_delete: false })
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
 * Restore soft deleted sparepart
 */
const restore = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ sparepart_id: id })
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

