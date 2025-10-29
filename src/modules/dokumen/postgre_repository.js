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

/**
 * Duplicate document with all related item_categories and item_categories_details
 */
const duplicate = async (dokumenId, userId) => {
  const trx = await db.transaction();
  
  try {
    // 1. Get original dokumen
    const originalDokumen = await trx(TABLE_NAME)
      .where('dokumen_id', dokumenId)
      .where('deleted_at', null)
      .where('is_delete', false)
      .first();
    
    if (!originalDokumen) {
      await trx.rollback();
      return null;
    }
    
    // 2. Create new dokumen with duplicate name
    const newDokumenName = `dokumen_name_duplikat_${originalDokumen.dokumen_name}`;
    const [newDokumen] = await trx(TABLE_NAME)
      .insert({
        dokumen_name: newDokumenName,
        dokumen_description: originalDokumen.dokumen_description,
        created_by: userId,
        updated_by: userId,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    
    // 3. Get all item_categories for this dokumen
    const itemCategories = await trx('item_categories')
      .where('dokumen_id', dokumenId)
      .where('deleted_at', null)
      .where('is_delete', false);
    
    // 4. Duplicate each item_category and its details
    const itemCategoryMap = {}; // Map old item_category_id to new item_category_id
    
    for (const itemCategory of itemCategories) {
      // Create new item_category
      const [newItemCategory] = await trx('item_categories')
        .insert({
          type_category_id: itemCategory.type_category_id,
          category_id: itemCategory.category_id,
          dokumen_id: newDokumen.dokumen_id,
          item_category_name_en: itemCategory.item_category_name_en,
          item_category_name_cn: itemCategory.item_category_name_cn,
          item_category_description: itemCategory.item_category_description,
          item_category_foto: itemCategory.item_category_foto,
          created_by: userId,
          updated_by: userId,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        })
        .returning('*');
      
      itemCategoryMap[itemCategory.item_category_id] = newItemCategory.item_category_id;
      
      // Get all details for this item_category
      const itemCategoriesDetails = await trx('item_categories_details')
        .where('item_category_id', itemCategory.item_category_id)
        .where('deleted_at', null)
        .where('is_delete', false);
      
      // Duplicate item_categories_details
      if (itemCategoriesDetails.length > 0) {
        const newDetails = itemCategoriesDetails.map(detail => ({
          item_category_id: newItemCategory.item_category_id,
          target_id: detail.target_id,
          part_number: detail.part_number,
          catalog_item_name_en: detail.catalog_item_name_en,
          catalog_item_name_ch: detail.catalog_item_name_ch,
          description: detail.description,
          quantity: detail.quantity,
          unit: detail.unit,
          created_by: userId,
          updated_by: userId,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        }));
        
        await trx('item_categories_details').insert(newDetails);
      }
    }
    
    await trx.commit();
    
    // Return the new dokumen with all relations
    return await findById(newDokumen.dokumen_id);
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  restore,
  duplicate
};

