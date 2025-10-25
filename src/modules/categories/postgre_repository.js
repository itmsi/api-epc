const db = require('../../config/database').pgCore;
const typeCategoryRepository = require('../type_category/postgre_repository');

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
 * Find single item by ID dengan relasi type_categories
 */
const findById = async (id) => {
  const category = await db(TABLE_NAME)
    .where({ category_id: id, is_delete: false })
    .first();
    
  if (!category) {
    return null;
  }
  
  // Ambil data type_categories yang terkait
  const typeCategories = await db('type_categories')
    .where({ category_id: id, is_delete: false })
    .select('type_category_id', 'type_category_name_en', 'type_category_name_cn', 'type_category_description');
    
  return {
    ...category,
    data_type: typeCategories
  };
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
 * Create new item dengan data_type
 */
const create = async (data, userId) => {
  const { data_type, ...categoryData } = data;
  
  // Mulai transaksi
  const trx = await db.transaction();
  
  try {
    // Insert category
    const [category] = await trx(TABLE_NAME)
      .insert({
        ...categoryData,
        created_by: userId,
        updated_by: userId,
        created_at: trx.raw('now()'),
        updated_at: trx.raw('now()')
      })
      .returning('*');
    
    // Insert type_categories jika ada
    if (data_type && Array.isArray(data_type) && data_type.length > 0) {
      const typeCategoryData = data_type.map(type => ({
        ...type,
        category_id: category.category_id,
        created_by: userId,
        updated_by: userId,
        created_at: trx.raw('now()'),
        updated_at: trx.raw('now()')
      }));
      
      await trx('type_categories').insert(typeCategoryData);
    }
    
    await trx.commit();
    
    // Return category dengan data_type
    const result = await findById(category.category_id);
    return result;
    
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Update existing item dengan data_type
 */
const update = async (id, data, userId) => {
  const { data_type, ...categoryData } = data;
  
  // Mulai transaksi
  const trx = await db.transaction();
  
  try {
    // Update category
    const [category] = await trx(TABLE_NAME)
      .where({ category_id: id, is_delete: false })
      .update({
        ...categoryData,
        updated_by: userId,
        updated_at: trx.raw('now()')
      })
      .returning('*');
    
    if (!category) {
      await trx.rollback();
      return null;
    }
    
    // Update type_categories jika ada data_type
    if (data_type !== undefined) {
      // Hapus type_categories yang lama
      await trx('type_categories')
        .where({ category_id: id })
        .update({
          is_delete: true,
          deleted_at: trx.raw('now()'),
          deleted_by: userId,
          updated_at: trx.raw('now()'),
          updated_by: userId
        });
      
      // Insert type_categories yang baru jika ada
      if (Array.isArray(data_type) && data_type.length > 0) {
        const typeCategoryData = data_type.map(type => ({
          ...type,
          category_id: id,
          created_by: userId,
          updated_by: userId,
          created_at: trx.raw('now()'),
          updated_at: trx.raw('now()')
        }));
        
        await trx('type_categories').insert(typeCategoryData);
      }
    }
    
    await trx.commit();
    
    // Return category dengan data_type
    const result = await findById(id);
    return result;
    
  } catch (error) {
    await trx.rollback();
    throw error;
  }
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

