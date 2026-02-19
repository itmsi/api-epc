const db = require('../../config/database').pgCore;
const { setupDblink } = require('../../utils/dblink');

const TABLE_NAME = 'vin_customer';
const PRODUCTS_TABLE = 'products';

/**
 * Find all vin_customer records with pagination and filters
 */
const findAll = async (page = 1, limit = 10, search = '', sort_by = 'created_at', sort_order = 'desc', filters = {}) => {
  const offset = (page - 1) * limit;
  
  // Setup dblink untuk customer name dari SSO
  const dblinkReady = await setupDblink();
  
  let query = db(TABLE_NAME)
    .where({ [`${TABLE_NAME}.deleted_at`]: null });
  
  // Apply filters
  if (filters.customer_id) {
    query = query.where({ [`${TABLE_NAME}.customer_id`]: filters.customer_id });
  }
  if (filters.product_id) {
    query = query.where({ [`${TABLE_NAME}.product_id`]: filters.product_id });
  }
  
  // Build query with product and customer data
  if (dblinkReady) {
    try {
      // Create dblink subquery for customer data from SSO
      const dblinkSubquery = db.raw(`
        dblink('gate_sso_conn', 
          'SELECT 
            c.customer_id::text, 
            c.customer_name
          FROM customers c
          WHERE c.is_delete = false'
        ) AS customer_data(customer_id text, customer_name varchar)
      `);
      
      query = query
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_name_en`,
          `${PRODUCTS_TABLE}.product_name_cn`,
          `${PRODUCTS_TABLE}.vin_number`,
          db.raw('customer_data.customer_name as customer_name')
        )
        .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`)
        .leftJoin(dblinkSubquery, function() {
          this.on(db.raw(`${TABLE_NAME}.customer_id::text`), '=', db.raw('customer_data.customer_id'));
        });
    } catch (dblinkError) {
      console.warn('[VIN_CUSTOMER] Error setting up dblink, using query without customer name:', dblinkError.message);
      // Fallback: query without customer name
      query = query
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_name_en`,
          `${PRODUCTS_TABLE}.product_name_cn`,
          `${PRODUCTS_TABLE}.vin_number`,
          db.raw('NULL::varchar as customer_name')
        )
        .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`);
    }
  } else {
    // Fallback: query without customer name
    query = query
      .select(
        `${TABLE_NAME}.*`,
        `${PRODUCTS_TABLE}.product_name_en`,
        `${PRODUCTS_TABLE}.product_name_cn`,
        `${PRODUCTS_TABLE}.vin_number`,
        db.raw('NULL::varchar as customer_name')
      )
      .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`);
  }
  
  // Apply search filter
  if (search) {
    const searchTerm = `%${search}%`;
    query = query.where(function() {
      this.where(`${PRODUCTS_TABLE}.product_name_en`, 'ilike', searchTerm)
        .orWhere(`${PRODUCTS_TABLE}.product_name_cn`, 'ilike', searchTerm)
        .orWhere(`${PRODUCTS_TABLE}.vin_number`, 'ilike', searchTerm)
        .orWhere(db.raw('customer_data.customer_name'), 'ilike', searchTerm);
    });
  }
  
  // Apply sorting - validate sort_by to prevent SQL injection
  const allowedSortFields = ['created_at', 'updated_at', 'product_name_en', 'vin_number', 'customer_name'];
  const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
  const sortDirection = sort_order.toLowerCase() === 'asc' ? 'asc' : 'desc';
  
  // Determine sort column with table prefix
  let sortColumn;
  if (sortField === 'product_name_en' || sortField === 'vin_number') {
    sortColumn = `${PRODUCTS_TABLE}.${sortField}`;
  } else if (sortField === 'customer_name') {
    sortColumn = db.raw('customer_data.customer_name');
  } else {
    sortColumn = `${TABLE_NAME}.${sortField}`;
  }
  
  query = query.orderBy(sortColumn, sortDirection);
  
  const data = await query.limit(limit).offset(offset);
  
  // Count total with same filters and search
  let countQuery = db(TABLE_NAME)
    .where({ deleted_at: null })
    .modify((qb) => {
      if (filters.customer_id) qb.where({ customer_id: filters.customer_id });
      if (filters.product_id) qb.where({ product_id: filters.product_id });
    });
  
  // Apply search to count query if needed
  if (search) {
    const searchTerm = `%${search}%`;
    countQuery = countQuery
      .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`)
      .where(function() {
        this.where(`${PRODUCTS_TABLE}.product_name_en`, 'ilike', searchTerm)
          .orWhere(`${PRODUCTS_TABLE}.product_name_cn`, 'ilike', searchTerm)
          .orWhere(`${PRODUCTS_TABLE}.vin_number`, 'ilike', searchTerm);
      });
  }
  
  const total = await countQuery.count('id as count').first();
  
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
 * Find single vin_customer by ID with product details
 */
const findById = async (id) => {
  const dblinkReady = await setupDblink();
  
  if (dblinkReady) {
    try {
      const dblinkSubquery = db.raw(`
        dblink('gate_sso_conn', 
          'SELECT 
            c.customer_id::text, 
            c.customer_name
          FROM customers c
          WHERE c.is_delete = false'
        ) AS customer_data(customer_id text, customer_name varchar)
      `);
      
      return await db(TABLE_NAME)
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_name_en`,
          `${PRODUCTS_TABLE}.product_name_cn`,
          `${PRODUCTS_TABLE}.product_description`,
          `${PRODUCTS_TABLE}.vin_number`,
          db.raw('customer_data.customer_name as customer_name')
        )
        .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`)
        .leftJoin(dblinkSubquery, function() {
          this.on(db.raw(`${TABLE_NAME}.customer_id::text`), '=', db.raw('customer_data.customer_id'));
        })
        .where({ [`${TABLE_NAME}.id`]: id, [`${TABLE_NAME}.deleted_at`]: null })
        .first();
    } catch (error) {
      console.warn('[VIN_CUSTOMER] Error with dblink in findById:', error.message);
    }
  }
  
  // Fallback without customer name
  return await db(TABLE_NAME)
    .select(
      `${TABLE_NAME}.*`,
      `${PRODUCTS_TABLE}.product_name_en`,
      `${PRODUCTS_TABLE}.product_name_cn`,
      `${PRODUCTS_TABLE}.product_description`,
      `${PRODUCTS_TABLE}.vin_number`,
      db.raw('NULL::varchar as customer_name')
    )
    .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`)
    .where({ [`${TABLE_NAME}.id`]: id, [`${TABLE_NAME}.deleted_at`]: null })
    .first();
};

/**
 * Find all products by customer ID
 */
const findByCustomerId = async (customerId) => {
  const dblinkReady = await setupDblink();
  
  if (dblinkReady) {
    try {
      const dblinkSubquery = db.raw(`
        dblink('gate_sso_conn', 
          'SELECT 
            c.customer_id::text, 
            c.customer_name
          FROM customers c
          WHERE c.is_delete = false'
        ) AS customer_data(customer_id text, customer_name varchar)
      `);
      
      return await db(TABLE_NAME)
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_name_en`,
          `${PRODUCTS_TABLE}.product_name_cn`,
          `${PRODUCTS_TABLE}.product_description`,
          `${PRODUCTS_TABLE}.vin_number`,
          db.raw('customer_data.customer_name as customer_name')
        )
        .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`)
        .leftJoin(dblinkSubquery, function() {
          this.on(db.raw(`${TABLE_NAME}.customer_id::text`), '=', db.raw('customer_data.customer_id'));
        })
        .where({ 
          [`${TABLE_NAME}.customer_id`]: customerId, 
          [`${TABLE_NAME}.deleted_at`]: null 
        })
        .orderBy(`${TABLE_NAME}.created_at`, 'desc');
    } catch (error) {
      console.warn('[VIN_CUSTOMER] Error with dblink in findByCustomerId:', error.message);
    }
  }
  
  // Fallback without customer name
  return await db(TABLE_NAME)
    .select(
      `${TABLE_NAME}.customer_name`,
      `${PRODUCTS_TABLE}.product_name_en`,
      `${PRODUCTS_TABLE}.product_name_cn`,
      `${PRODUCTS_TABLE}.product_description`,
      `${PRODUCTS_TABLE}.vin_number`,
      db.raw('NULL::varchar as customer_name')
    )
    .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`)
    .where({ 
      [`${TABLE_NAME}.customer_id`]: customerId, 
      [`${TABLE_NAME}.deleted_at`]: null 
    })
    .orderBy(`${TABLE_NAME}.created_at`, 'desc');
};

/**
 * Find all customers by product ID
 */
const findByProductId = async (productId) => {
  return await db(TABLE_NAME)
    .select('*')
    .where({ product_id: productId, deleted_at: null })
    .orderBy('created_at', 'desc');
};

/**
 * Create single vin_customer record
 */
const create = async (data, userId) => {
  const [result] = await db(TABLE_NAME)
    .insert({
      customer_id: data.customer_id,
      product_id: data.product_id,
      created_by: userId,
      created_at: db.fn.now(),
    })
    .returning('*');
  return result;
};

/**
 * Bulk create vin_customer records for multiple products
 */
const bulkCreate = async (customerId, productIds, userId) => {
  const records = productIds.map(productId => ({
    customer_id: customerId,
    product_id: productId,
    created_by: userId,
    created_at: db.fn.now(),
  }));
  
  const results = await db(TABLE_NAME)
    .insert(records)
    .returning('*');
    
  return results;
};


/**
 * Update - replace products for same customer OR transfer products to new customer
 * @param {string} customerId - Original customer ID (from URL param)
 * @param {array} productIds - Array of product IDs
 * @param {string} userId - User ID performing the update
 * @param {string} newCustomerId - Optional: New customer ID to transfer products to
 */
const update = async (customerId, productIds, userId, newCustomerId = null) => {
  return await db.transaction(async (trx) => {
    // Case 1: Transfer products to a NEW customer
    if (newCustomerId && newCustomerId !== customerId) {
      // 1. Check if target customer already has any of these products
      const existingInTarget = await trx(TABLE_NAME)
        .where({ customer_id: newCustomerId, deleted_at: null })
        .whereIn('product_id', productIds)
        .select('product_id');
      
      if (existingInTarget.length > 0) {
        const conflictProducts = existingInTarget.map(r => r.product_id);
        throw Object.assign(
          new Error(`Customer tujuan sudah memiliki product: ${conflictProducts.join(', ')}`),
          { code: '23505' } // Simulate unique constraint violation
        );
      }
      
      // 2. Update customer_id for the specified products from old customer to new customer
      const updated = await trx(TABLE_NAME)
        .where({ customer_id: customerId, deleted_at: null })
        .whereIn('product_id', productIds)
        .update({
          customer_id: newCustomerId,
          updated_by: userId,
          updated_at: trx.fn.now()
        })
        .returning('*');
      
      return updated;
    }
    
    // Case 2: Replace products for the SAME customer (original logic)
    else {
      // 1. Get existing active products for this customer
      const existingRecords = await trx(TABLE_NAME)
        .where({ customer_id: customerId, deleted_at: null })
        .select('product_id');
      
      const existingProductIds = existingRecords.map(r => r.product_id);
      
      // 2. Identify products to add and remove
      const toAdd = productIds.filter(id => !existingProductIds.includes(id));
      const toDelete = existingProductIds.filter(id => !productIds.includes(id));
      
      // 3. Remove products that are no longer in the list
      if (toDelete.length > 0) {
        await trx(TABLE_NAME)
          .where({ customer_id: customerId, deleted_at: null })
          .whereIn('product_id', toDelete)
          .update({
            deleted_at: trx.fn.now(),
            deleted_by: userId,
            is_delete: true
          });
      }
      
      // 4. Create new product assignments
      if (toAdd.length > 0) {
        const newRecords = toAdd.map(productId => ({
          customer_id: customerId,
          product_id: productId,
          created_by: userId
        }));
        
        await trx(TABLE_NAME).insert(newRecords);
      }
      
      // 5. Return the updated list of assignments for this customer
      return await trx(TABLE_NAME)
        .where({ customer_id: customerId, deleted_at: null })
        .select('*');
    }
  });
};

/**
 * Remove - soft delete all records by customer ID
 */
const remove = async (customerId, userId) => {
  const results = await db(TABLE_NAME)
    .where({ customer_id: customerId, deleted_at: null })
    .update({
      deleted_at: db.fn.now(),
      deleted_by: userId,
      is_delete: true
    })
    .returning('*');
    
  return results;
};

/**
 * Restore soft deleted vin_customer record
 */
const restore = async (id, userId) => {
  const [result] = await db(TABLE_NAME)
    .where({ id })
    .whereNotNull('deleted_at')
    .update({
      deleted_at: null,
      deleted_by: null,
      is_delete: false,
      updated_by: userId,
      updated_at: db.fn.now()
    })
    .returning('*');
    
  return result;
};

/**
 * Hard delete vin_customer record (permanent)
 */
const hardDelete = async (id) => {
  return await db(TABLE_NAME)
    .where({ id })
    .del();
};

module.exports = {
  findAll,
  findById,
  findByCustomerId,
  findByProductId,
  create,
  bulkCreate,
  update,
  remove,
  restore,
  hardDelete
};
