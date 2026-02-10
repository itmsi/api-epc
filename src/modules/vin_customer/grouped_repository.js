const db = require('../../config/database').pgCore;
const { setupDblink } = require('../../utils/dblink');

const TABLE_NAME = 'vin_customer';
const PRODUCTS_TABLE = 'products';

/**
 * Find all customers with their products grouped
 * Returns data grouped by customer with products array
 */
const findAllGrouped = async (page = 1, limit = 10, search = '', sort_by = 'created_at', sort_order = 'desc') => {
  const offset = (page - 1) * limit;
  
  // Setup dblink untuk customer name dari SSO
  const dblinkReady = await setupDblink();
  
  // First, get all vin_customer records with joins
  let dataQuery = db(TABLE_NAME)
    .where({ [`${TABLE_NAME}.deleted_at`]: null });
  
  // Build query with product and customer data
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
      
      dataQuery = dataQuery
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_id`,
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
      console.warn('[VIN_CUSTOMER] Error setting up dblink:', dblinkError.message);
      dataQuery = dataQuery
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_id`,
          `${PRODUCTS_TABLE}.product_name_en`,
          `${PRODUCTS_TABLE}.product_name_cn`,
          `${PRODUCTS_TABLE}.vin_number`,
          db.raw('NULL::varchar as customer_name')
        )
        .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`);
    }
  } else {
    dataQuery = dataQuery
      .select(
        `${TABLE_NAME}.*`,
        `${PRODUCTS_TABLE}.product_id`,
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
    dataQuery = dataQuery.where(function() {
      this.where(`${PRODUCTS_TABLE}.product_name_en`, 'ilike', searchTerm)
        .orWhere(`${PRODUCTS_TABLE}.product_name_cn`, 'ilike', searchTerm)
        .orWhere(`${PRODUCTS_TABLE}.vin_number`, 'ilike', searchTerm)
        .orWhere(db.raw('customer_data.customer_name'), 'ilike', searchTerm);
    });
  }
  
  // Apply sorting
  const allowedSortFields = ['created_at', 'updated_at', 'product_name_en', 'vin_number', 'customer_name'];
  const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
  const sortDirection = sort_order.toLowerCase() === 'asc' ? 'asc' : 'desc';
  
  let sortColumn;
  if (sortField === 'product_name_en' || sortField === 'vin_number') {
    sortColumn = `${PRODUCTS_TABLE}.${sortField}`;
  } else if (sortField === 'customer_name') {
    sortColumn = db.raw('customer_data.customer_name');
  } else {
    sortColumn = `${TABLE_NAME}.${sortField}`;
  }
  
  dataQuery = dataQuery.orderBy(sortColumn, sortDirection);
  
  // Get all records (we'll paginate after grouping)
  const allRecords = await dataQuery;
  
  // Group by customer and count products
  const customersMap = {};
  allRecords.forEach(record => {
    const customerId = record.customer_id;
    
    if (!customersMap[customerId]) {
      customersMap[customerId] = {
        customer_id: customerId,
        customer_name: record.customer_name,
        count: 0
      };
    }
    
    // Count products (only if product_id exists)
    if (record.product_id) {
      customersMap[customerId].count++;
    }
  });
  
  // Convert to array
  const customersArray = Object.values(customersMap);
  
  // Paginate customers
  const total = customersArray.length;
  const paginatedCustomers = customersArray.slice(offset, offset + limit);
  
  return {
    items: paginatedCustomers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Find single customer by ID with their products
 */
const findCustomerByIdGrouped = async (customerId) => {
  const dblinkReady = await setupDblink();
  
  let query = db(TABLE_NAME)
    .where({ 
      [`${TABLE_NAME}.customer_id`]: customerId,
      [`${TABLE_NAME}.deleted_at`]: null 
    });
  
  // Build query with product and customer data
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
      
      query = query
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_id`,
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
      console.warn('[VIN_CUSTOMER] Error setting up dblink:', dblinkError.message);
      query = query
        .select(
          `${TABLE_NAME}.*`,
          `${PRODUCTS_TABLE}.product_id`,
          `${PRODUCTS_TABLE}.product_name_en`,
          `${PRODUCTS_TABLE}.product_name_cn`,
          `${PRODUCTS_TABLE}.vin_number`,
          db.raw('NULL::varchar as customer_name')
        )
        .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`);
    }
  } else {
    query = query
      .select(
        `${TABLE_NAME}.*`,
        `${PRODUCTS_TABLE}.product_id`,
        `${PRODUCTS_TABLE}.product_name_en`,
        `${PRODUCTS_TABLE}.product_name_cn`,
        `${PRODUCTS_TABLE}.vin_number`,
        db.raw('NULL::varchar as customer_name')
      )
      .leftJoin(PRODUCTS_TABLE, `${TABLE_NAME}.product_id`, `${PRODUCTS_TABLE}.product_id`);
  }
  
  const records = await query.orderBy(`${TABLE_NAME}.created_at`, 'desc');
  
  if (!records || records.length === 0) {
    return null;
  }
  
  // Group products
  const result = {
    customer_id: customerId,
    customer_name: records[0].customer_name,
    count: 0,
    products: []
  };
  
  records.forEach(record => {
    if (record.product_id) {
      result.products.push({
        id: record.id,
        product_id: record.product_id,
        product_name_en: record.product_name_en,
        product_name_cn: record.product_name_cn,
        vin_number: record.vin_number,
        created_at: record.created_at,
        created_by: record.created_by,
        updated_at: record.updated_at,
        updated_by: record.updated_by,
        deleted_at: record.deleted_at,
        deleted_by: record.deleted_by,
        is_delete: record.is_delete
      });
      result.count++;
    }
  });
  
  return result;
};

module.exports = {
  findAllGrouped,
  findCustomerByIdGrouped
};
