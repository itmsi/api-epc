const db = require('../../config/database').pgCore;

const TABLES = {
  PRODUCTS: 'products',
  PRODUCTS_DETAILS: 'products_details',
  DOKUMEN: 'dokumen'
};

/**
 * Find all products with pagination
 */
const findAll = async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit;
  
  let query = db(TABLES.PRODUCTS)
    .select([
      'p.*',
      'pd.product_detail_id',
      'pd.dokumen_id',
      'pd.product_detail_name_en',
      'pd.product_detail_name_cn',
      'pd.product_detail_description',
      'd.dokumen_name',
      'd.dokumen_description'
    ])
    .from(`${TABLES.PRODUCTS} as p`)
    .leftJoin(`${TABLES.PRODUCTS_DETAILS} as pd`, function() {
      this.on('p.product_id', '=', 'pd.product_id')
          .andOn('pd.deleted_at', '=', db.raw('NULL'))
          .andOn('pd.is_delete', '=', db.raw('false'));
    })
    .leftJoin(`${TABLES.DOKUMEN} as d`, 'pd.dokumen_id', 'd.dokumen_id')
    .where('p.deleted_at', null)
    .where('p.is_delete', false);

  // Add search functionality
  if (search) {
    query = query.where(function() {
      this.where('p.product_name_en', 'ilike', `%${search}%`)
        .orWhere('p.product_name_cn', 'ilike', `%${search}%`)
        .orWhere('p.vin_number', 'ilike', `%${search}%`)
        .orWhere('p.product_description', 'ilike', `%${search}%`);
    });
  }

  // Add sorting
  query = query.orderBy(`p.${sortBy}`, sortOrder);

  // Get unique products with their details
  const data = await query;
  
  // Group by product_id to aggregate details
  const groupedData = {};
  data.forEach(row => {
    if (!groupedData[row.product_id]) {
      groupedData[row.product_id] = {
        product_id: row.product_id,
        product_name_en: row.product_name_en,
        product_name_cn: row.product_name_cn,
        product_description: row.product_description,
        vin_number: row.vin_number,
        model_type: row.model_type,
        dimensi: row.dimensi,
        model_engine: row.model_engine,
        created_at: row.created_at,
        created_by: row.created_by,
        updated_at: row.updated_at,
        updated_by: row.updated_by,
        deleted_at: row.deleted_at,
        deleted_by: row.deleted_by,
        is_delete: row.is_delete,
        details: []
      };
    }
    
    if (row.product_detail_id) {
      groupedData[row.product_id].details.push({
        product_detail_id: row.product_detail_id,
        product_id: row.product_id,
        dokumen_id: row.dokumen_id,
        product_detail_name_en: row.product_detail_name_en,
        product_detail_name_cn: row.product_detail_name_cn,
        product_detail_description: row.product_detail_description,
        dokumen_name: row.dokumen_name,
        dokumen_description: row.dokumen_description
      });
    }
  });

  const items = Object.values(groupedData);
  
  // Apply pagination to grouped items
  const paginatedItems = items.slice(offset, offset + limit);
  
  // Get total count
  let countQuery = db(TABLES.PRODUCTS)
    .from(`${TABLES.PRODUCTS} as p`)
    .where('p.deleted_at', null)
    .where('p.is_delete', false);

  if (search) {
    countQuery = countQuery.where(function() {
      this.where('p.product_name_en', 'ilike', `%${search}%`)
        .orWhere('p.product_name_cn', 'ilike', `%${search}%`)
        .orWhere('p.vin_number', 'ilike', `%${search}%`)
        .orWhere('p.product_description', 'ilike', `%${search}%`);
    });
  }

  const total = await countQuery.count('p.product_id as count').first();
  
  return {
    items: paginatedItems,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total.count),
      totalPages: Math.ceil(total.count / limit)
    }
  };
};

/**
 * Find single product by ID with all related data
 */
const findById = async (id) => {
  const product = await db(TABLES.PRODUCTS)
    .select([
      'p.*'
    ])
    .from(`${TABLES.PRODUCTS} as p`)
    .where('p.product_id', id)
    .where('p.deleted_at', null)
    .where('p.is_delete', false)
    .first();

  if (!product) {
    return null;
  }

  // Get product details
  const details = await db(TABLES.PRODUCTS_DETAILS)
    .select([
      'pd.*',
      'd.dokumen_name',
      'd.dokumen_description'
    ])
    .from(`${TABLES.PRODUCTS_DETAILS} as pd`)
    .leftJoin(`${TABLES.DOKUMEN} as d`, 'pd.dokumen_id', 'd.dokumen_id')
    .where('pd.product_id', id)
    .where('pd.deleted_at', null)
    .where('pd.is_delete', false);

  return {
    ...product,
    details
  };
};

/**
 * Create new product with details
 */
const create = async (data, userId) => {
  const trx = await db.transaction();
  
  try {
    // Create product
    const [product] = await trx(TABLES.PRODUCTS)
      .insert({
        product_name_en: data.product_name_en,
        product_name_cn: data.product_name_cn,
        product_description: data.product_description,
        vin_number: data.vin_number,
        model_type: data.model_type,
        dimensi: data.dimensi,
        model_engine: data.model_engine,
        created_by: userId,
        updated_by: userId,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    // Create product details
    if (data.data_details && data.data_details.length > 0) {
      for (const detail of data.data_details) {
        await trx(TABLES.PRODUCTS_DETAILS)
          .insert({
            product_id: product.product_id,
            dokumen_id: detail.dokumen_id || null,
            product_detail_name_en: detail.product_detail_name_en || null,
            product_detail_name_cn: detail.product_detail_name_cn || null,
            product_detail_description: detail.product_detail_description || null,
            created_by: userId,
            updated_by: userId,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
          });
      }
    }

    await trx.commit();
    return await findById(product.product_id);
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Update existing product
 */
const update = async (id, data, userId) => {
  const trx = await db.transaction();
  
  try {
    // Check if product exists
    const existingProduct = await trx(TABLES.PRODUCTS)
      .where('product_id', id)
      .where('deleted_at', null)
      .where('is_delete', false)
      .first();

    if (!existingProduct) {
      await trx.rollback();
      return null;
    }
    
    // Update product
    const [updatedProduct] = await trx(TABLES.PRODUCTS)
      .where('product_id', id)
      .update({
        product_name_en: data.product_name_en,
        product_name_cn: data.product_name_cn,
        product_description: data.product_description,
        vin_number: data.vin_number,
        model_type: data.model_type,
        dimensi: data.dimensi,
        model_engine: data.model_engine,
        updated_by: userId,
        updated_at: db.fn.now()
      })
      .returning('*');

    // Delete existing details (hard delete)
    await trx(TABLES.PRODUCTS_DETAILS)
      .where('product_id', id)
      .del();

    // Create new details
    if (data.data_details && data.data_details.length > 0) {
      for (const detail of data.data_details) {
        await trx(TABLES.PRODUCTS_DETAILS)
          .insert({
            product_id: id,
            dokumen_id: detail.dokumen_id || null,
            product_detail_name_en: detail.product_detail_name_en || null,
            product_detail_name_cn: detail.product_detail_name_cn || null,
            product_detail_description: detail.product_detail_description || null,
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
 * Soft delete product
 */
const remove = async (id, userId) => {
  const trx = await db.transaction();
  
  try {
    // Soft delete product
    const [deletedProduct] = await trx(TABLES.PRODUCTS)
      .where('product_id', id)
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

    if (!deletedProduct) {
      await trx.rollback();
      return null;
    }

    // Soft delete all related details
    await trx(TABLES.PRODUCTS_DETAILS)
      .where('product_id', id)
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
    return deletedProduct;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Restore soft deleted product
 */
const restore = async (id, userId) => {
  const trx = await db.transaction();
  
  try {
    // Restore product
    const [restoredProduct] = await trx(TABLES.PRODUCTS)
      .where('product_id', id)
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

    if (!restoredProduct) {
      await trx.rollback();
      return null;
    }

    // Restore all related details
    await trx(TABLES.PRODUCTS_DETAILS)
      .where('product_id', id)
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

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  restore
};

