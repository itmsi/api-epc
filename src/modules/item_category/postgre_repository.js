const db = require('../../config/database').pgCore;

const TABLES = {
  ITEM_CATEGORIES: 'item_categories',
  ITEM_CATEGORIES_DETAILS: 'item_categories_details',
  DOKUMEN: 'dokumen',
  UNITS: 'units',
  MASTER_CATEGORIES: 'master_categories',
  CATEGORIES: 'categories',
  TYPE_CATEGORIES: 'type_categories'
};

/**
 * Find all item categories with pagination and joins
 */
const findAll = async (page = 1, limit = 10, search = '', sortBy = 'd.created_at', sortOrder = 'desc', filters = {}) => {
  const offset = (page - 1) * limit;
  
  // Determine sort column - add table prefix if not present
  const sortColumn = sortBy.includes('.') ? sortBy : `d.${sortBy}`;
  
  let query = db(TABLES.ITEM_CATEGORIES)
    .select([
      'd.dokumen_id',
      'd.dokumen_name',
      'd.created_at',
      db.raw('COALESCE(mc_type.master_category_id, mc_direct.master_category_id) as master_category_id'),
      db.raw('COALESCE(mc_type.master_category_name_en, mc_direct.master_category_name_en) as master_category_name_en'),
      db.raw('COALESCE(mc_type.master_category_name_cn, mc_direct.master_category_name_cn) as master_category_name_cn')
    ])
    .from(`${TABLES.ITEM_CATEGORIES} as ic`)
    .leftJoin(`${TABLES.DOKUMEN} as d`, 'ic.dokumen_id', 'd.dokumen_id')
    .leftJoin(`${TABLES.TYPE_CATEGORIES} as tc`, 'ic.type_category_id', 'tc.type_category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_type`, 'tc.category_id', 'c_type.category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_direct`, 'ic.category_id', 'c_direct.category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_type`, 'c_type.master_category_id', 'mc_type.master_category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_direct`, 'c_direct.master_category_id', 'mc_direct.master_category_id')
    .where('ic.deleted_at', null)
    .where('ic.is_delete', false)
    .distinct();

  // Add search functionality
  if (search) {
    query = query.where(function() {
      this.where('d.dokumen_name', 'ilike', `%${search}%`)
        .orWhere('mc_type.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_type.master_category_name_cn', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_cn', 'ilike', `%${search}%`);
    });
  }

  // Add filters
  if (filters.master_category_name_en) {
    query = query.where(function() {
      this.where('mc_type.master_category_name_en', 'ilike', `%${filters.master_category_name_en}%`)
        .orWhere('mc_direct.master_category_name_en', 'ilike', `%${filters.master_category_name_en}%`);
    });
  }

  if (filters.dokumen_name) {
    query = query.where('d.dokumen_name', 'ilike', `%${filters.dokumen_name}%`);
  }

  // Add sorting - sortColumn already determined above
  query = query.orderBy(sortColumn, sortOrder);

  const data = await query.limit(limit).offset(offset);
  
  // Get total count
  let countQuery = db(TABLES.ITEM_CATEGORIES)
    .from(`${TABLES.ITEM_CATEGORIES} as ic`)
    .leftJoin(`${TABLES.DOKUMEN} as d`, 'ic.dokumen_id', 'd.dokumen_id')
    .leftJoin(`${TABLES.TYPE_CATEGORIES} as tc`, 'ic.type_category_id', 'tc.type_category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_type`, 'tc.category_id', 'c_type.category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_direct`, 'ic.category_id', 'c_direct.category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_type`, 'c_type.master_category_id', 'mc_type.master_category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_direct`, 'c_direct.master_category_id', 'mc_direct.master_category_id')
    .where('ic.deleted_at', null)
    .where('ic.is_delete', false);

  if (search) {
    countQuery = countQuery.where(function() {
      this.where('d.dokumen_name', 'ilike', `%${search}%`)
        .orWhere('mc_type.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_type.master_category_name_cn', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_cn', 'ilike', `%${search}%`);
    });
  }

  // Add filters to count query
  if (filters.master_category_name_en) {
    countQuery = countQuery.where(function() {
      this.where('mc_type.master_category_name_en', 'ilike', `%${filters.master_category_name_en}%`)
        .orWhere('mc_direct.master_category_name_en', 'ilike', `%${filters.master_category_name_en}%`);
    });
  }

  if (filters.dokumen_name) {
    countQuery = countQuery.where('d.dokumen_name', 'ilike', `%${filters.dokumen_name}%`);
  }

  // Get count of unique combinations
  const countResult = await countQuery
    .select([
      'd.dokumen_id',
      db.raw('COALESCE(mc_type.master_category_id, mc_direct.master_category_id) as master_category_id')
    ])
    .distinct();
  
  const total = { count: countResult.length };
  
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
 * Find single item category by ID with all related data
 */
const findById = async (id) => {
  const itemCategory = await db(TABLES.ITEM_CATEGORIES)
    .select([
      'ic.*',
      'd.dokumen_name',
      'd.dokumen_description',
      'tc.type_category_name_en',
      'tc.type_category_name_cn',
      db.raw('COALESCE(c_type.category_name_en, c_direct.category_name_en) as category_name_en'),
      db.raw('COALESCE(c_type.category_name_cn, c_direct.category_name_cn) as category_name_cn'),
      db.raw('COALESCE(mc_type.master_category_id, mc_direct.master_category_id) as master_category_id'),
      db.raw('COALESCE(mc_type.master_category_name_en, mc_direct.master_category_name_en) as master_category_name_en'),
      db.raw('COALESCE(mc_type.master_category_name_cn, mc_direct.master_category_name_cn) as master_category_name_cn')
    ])
    .from(`${TABLES.ITEM_CATEGORIES} as ic`)
    .leftJoin(`${TABLES.DOKUMEN} as d`, 'ic.dokumen_id', 'd.dokumen_id')
    .leftJoin(`${TABLES.TYPE_CATEGORIES} as tc`, 'ic.type_category_id', 'tc.type_category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_type`, 'tc.category_id', 'c_type.category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_direct`, 'ic.category_id', 'c_direct.category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_type`, 'c_type.master_category_id', 'mc_type.master_category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_direct`, 'c_direct.master_category_id', 'mc_direct.master_category_id')
    .where('ic.item_category_id', id)
    .where('ic.deleted_at', null)
    .where('ic.is_delete', false)
    .first();

  if (!itemCategory) {
    return null;
  }

  // Get item category details
  const details = await db(TABLES.ITEM_CATEGORIES_DETAILS)
    .select([
      'icd.*',
      'u.unit_name_en',
      'u.unit_name_cn'
    ])
    .from(`${TABLES.ITEM_CATEGORIES_DETAILS} as icd`)
    .leftJoin(`${TABLES.UNITS} as u`, 'icd.unit', 'u.unit_name_en')
    .where('icd.item_category_id', id)
    .where('icd.deleted_at', null)
    .where('icd.is_delete', false);

  return {
    ...itemCategory,
    details
  };
};

/**
 * Find or create dokumen
 */
const findOrCreateDokumen = async (dokumenName, userId) => {
  if (!dokumenName) return null;

  let dokumen = await db(TABLES.DOKUMEN)
    .where('dokumen_name', dokumenName)
    .where('deleted_at', null)
    .where('is_delete', false)
    .first();

  if (!dokumen) {
    const [newDokumen] = await db(TABLES.DOKUMEN)
      .insert({
        dokumen_name: dokumenName,
        created_by: userId,
        updated_by: userId,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    dokumen = newDokumen;
  }

  return dokumen;
};

/**
 * Find or create unit
 */
const findOrCreateUnit = async (unitName, userId) => {
  if (!unitName) return null;

  let unit = await db(TABLES.UNITS)
    .where('unit_name_en', unitName)
    .where('deleted_at', null)
    .where('is_delete', false)
    .first();

  if (!unit) {
    const [newUnit] = await db(TABLES.UNITS)
      .insert({
        unit_name_en: unitName,
        unit_name_cn: unitName,
        created_by: userId,
        updated_by: userId,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');
    unit = newUnit;
  }

  return unit;
};

/**
 * Create new item category with details
 */
const create = async (data, userId) => {
  const trx = await db.transaction();
  
  try {
    // Find or create dokumen
    const dokumen = await findOrCreateDokumen(data.dokumen_name, userId);
    
    // Create item category
    const [itemCategory] = await trx(TABLES.ITEM_CATEGORIES)
      .insert({
        type_category_id: data.type_category_id || null,
        category_id: data.category_id || null,
        dokumen_id: dokumen ? dokumen.dokumen_id : null,
        item_category_name_en: data.item_category_name_en,
        item_category_name_cn: data.item_category_name_cn,
        item_category_description: data.item_category_description,
        item_category_foto: data.item_category_foto,
        created_by: userId,
        updated_by: userId,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    // Create item category details
    if (data.data_items && data.data_items.length > 0) {
      for (const item of data.data_items) {
        const unit = await findOrCreateUnit(item.unit, userId);
        
        await trx(TABLES.ITEM_CATEGORIES_DETAILS)
          .insert({
            item_category_id: itemCategory.item_category_id,
            target_id: item.target_id,
            part_number: item.part_number,
            catalog_item_name_en: item.catalog_item_name_en,
            catalog_item_name_ch: item.catalog_item_name_ch,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            created_by: userId,
            updated_by: userId,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
          });
      }
    }

    await trx.commit();
    return await findById(itemCategory.item_category_id);
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Update existing item category
 */
const update = async (id, data, userId) => {
  const trx = await db.transaction();
  
  try {
    // Check if item category exists
    const existingItem = await trx(TABLES.ITEM_CATEGORIES)
      .where('item_category_id', id)
      .where('deleted_at', null)
      .where('is_delete', false)
      .first();

    if (!existingItem) {
      await trx.rollback();
      return null;
    }

    // Update dokumen if dokumen_id exists and dokumen_name is provided
    if (existingItem.dokumen_id && data.dokumen_name) {
      await trx(TABLES.DOKUMEN)
        .where('dokumen_id', existingItem.dokumen_id)
        .update({
          dokumen_name: data.dokumen_name,
          updated_by: userId,
          updated_at: db.fn.now()
        });
    }
    
    // Update item category
    const [updatedItem] = await trx(TABLES.ITEM_CATEGORIES)
      .where('item_category_id', id)
      .update({
        type_category_id: data.type_category_id || null,
        category_id: data.category_id || null,
        item_category_name_en: data.item_category_name_en,
        item_category_name_cn: data.item_category_name_cn,
        item_category_description: data.item_category_description,
        item_category_foto: data.item_category_foto,
        updated_by: userId,
        updated_at: db.fn.now()
      })
      .returning('*');

    // Delete existing details (hard delete)
    await trx(TABLES.ITEM_CATEGORIES_DETAILS)
      .where('item_category_id', id)
      .del();

    // Create new details
    if (data.data_items && data.data_items.length > 0) {
      for (const item of data.data_items) {
        const unit = await findOrCreateUnit(item.unit, userId);
        
        await trx(TABLES.ITEM_CATEGORIES_DETAILS)
          .insert({
            item_category_id: id,
            target_id: item.target_id,
            part_number: item.part_number,
            catalog_item_name_en: item.catalog_item_name_en,
            catalog_item_name_ch: item.catalog_item_name_ch,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            created_by: userId,
            updated_by: userId,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
          });
      }
    }

    await trx.commit();
    return await findById(id);
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Soft delete item category
 */
const remove = async (id, userId) => {
  const trx = await db.transaction();
  
  try {
    // Soft delete item category
    const [deletedItem] = await trx(TABLES.ITEM_CATEGORIES)
      .where('item_category_id', id)
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

    if (!deletedItem) {
      await trx.rollback();
      return null;
    }

    // Soft delete all related details
    await trx(TABLES.ITEM_CATEGORIES_DETAILS)
      .where('item_category_id', id)
      .where('deleted_at', null)
      .where('is_delete', false)
      .update({
        deleted_at: db.fn.now(),
        deleted_by: userId,
        is_delete: true,
        updated_at: db.fn.now(),
        updated_by: userId
      });

    await trx.commit();
    return deletedItem;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Restore soft deleted item category
 */
const restore = async (id, userId) => {
  const trx = await db.transaction();
  
  try {
    // Restore item category
    const [restoredItem] = await trx(TABLES.ITEM_CATEGORIES)
      .where('item_category_id', id)
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

    if (!restoredItem) {
      await trx.rollback();
      return null;
    }

    // Restore all related details
    await trx(TABLES.ITEM_CATEGORIES_DETAILS)
      .where('item_category_id', id)
      .whereNotNull('deleted_at')
      .where('is_delete', true)
      .update({
        deleted_at: null,
        deleted_by: null,
        is_delete: false,
        updated_at: db.fn.now(),
        updated_by: userId
      });

    await trx.commit();
    return await findById(id);
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Find all item categories by dokumen_id with category and type_category info with pagination
 */
const findByDokumenId = async (dokumenId, page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit;
  
  // First, get dokumen info
  const dokumen = await db(TABLES.DOKUMEN)
    .where('dokumen_id', dokumenId)
    .where('deleted_at', null)
    .where('is_delete', false)
    .first();
  
  if (!dokumen) {
    return {
      dokumen_name: null,
      master_category_name_en: null,
      master_category_name_cn: null,
      items: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0
      }
    };
  }
  
  let query = db(TABLES.ITEM_CATEGORIES)
    .select([
      'ic.item_category_id',
      'ic.dokumen_id',
      'tc.type_category_name_en',
      'tc.type_category_name_cn',
      db.raw('c_direct.category_name_en as category_name_en'),
      db.raw('c_direct.category_name_cn as category_name_cn'),
      db.raw('COALESCE(mc_type.master_category_id, mc_direct.master_category_id) as master_category_id'),
      db.raw('COALESCE(mc_type.master_category_name_en, mc_direct.master_category_name_en) as master_category_name_en'),
      db.raw('COALESCE(mc_type.master_category_name_cn, mc_direct.master_category_name_cn) as master_category_name_cn')
    ])
    .from(`${TABLES.ITEM_CATEGORIES} as ic`)
    .leftJoin(`${TABLES.TYPE_CATEGORIES} as tc`, 'ic.type_category_id', 'tc.type_category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_type`, 'tc.category_id', 'c_type.category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_direct`, 'ic.category_id', 'c_direct.category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_type`, 'c_type.master_category_id', 'mc_type.master_category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_direct`, 'c_direct.master_category_id', 'mc_direct.master_category_id')
    .where('ic.dokumen_id', dokumenId)
    .where('ic.deleted_at', null)
    .where('ic.is_delete', false)
    .distinct();

  // Add search functionality
  if (search) {
    query = query.where(function() {
      this.where('mc_type.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_type.master_category_name_cn', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_cn', 'ilike', `%${search}%`);
    });
  }

  // Add sorting
  query = query.orderBy('master_category_name_en', sortOrder);

  const data = await query.limit(limit).offset(offset);
  
  // Get total count with same joins and filters
  let countQuery = db(TABLES.ITEM_CATEGORIES)
    .from(`${TABLES.ITEM_CATEGORIES} as ic`)
    .leftJoin(`${TABLES.TYPE_CATEGORIES} as tc`, 'ic.type_category_id', 'tc.type_category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_type`, 'tc.category_id', 'c_type.category_id')
    .leftJoin(`${TABLES.CATEGORIES} as c_direct`, 'ic.category_id', 'c_direct.category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_type`, 'c_type.master_category_id', 'mc_type.master_category_id')
    .leftJoin(`${TABLES.MASTER_CATEGORIES} as mc_direct`, 'c_direct.master_category_id', 'mc_direct.master_category_id')
    .where('ic.dokumen_id', dokumenId)
    .where('ic.deleted_at', null)
    .where('ic.is_delete', false);

  // Add search functionality to count query
  if (search) {
    countQuery = countQuery.where(function() {
      this.where('mc_type.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_en', 'ilike', `%${search}%`)
        .orWhere('mc_type.master_category_name_cn', 'ilike', `%${search}%`)
        .orWhere('mc_direct.master_category_name_cn', 'ilike', `%${search}%`);
    });
  }

  // Count unique master categories
  const countResult = await countQuery
    .select(db.raw('COALESCE(mc_type.master_category_id, mc_direct.master_category_id) as master_category_id'))
    .distinct();
  
  const total = { count: countResult.length };
  
  // Get first master category info if exists (for dokumen level info)
  const firstMasterCategory = data.length > 0 ? data[0] : null;
  
  return {
    dokumen_name: dokumen.dokumen_name,
    master_category_name_en: firstMasterCategory ? firstMasterCategory.master_category_name_en : null,
    master_category_name_cn: firstMasterCategory ? firstMasterCategory.master_category_name_cn : null,
    items: data.map(item => ({
      item_category_id: item.item_category_id,
      dokumen_id: item.dokumen_id,
      master_category_id: item.master_category_id,
      master_category_name_en: item.master_category_name_en,
      master_category_name_cn: item.master_category_name_cn,
      category_name_en: item.category_name_en,
      category_name_cn: item.category_name_cn,
      type_category_name_en: item.type_category_name_en,
      type_category_name_cn: item.type_category_name_cn
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total.count),
      totalPages: Math.ceil(total.count / limit)
    }
  };
};

module.exports = {
  findAll,
  findById,
  findByDokumenId,
  create,
  update,
  remove,
  restore
};
