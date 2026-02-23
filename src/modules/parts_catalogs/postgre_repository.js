const db = require('../../config/database').pgCore;
const { setupDblink } = require('../../utils/dblink');

const TABLES = {
  PRODUCTS: 'products',
  VIN_CUSTOMERS: 'vin_customer',
  PRODUCTS_DETAILS: 'products_details',
  ITEM_CATEGORIES: 'item_categories',
  ITEM_CATEGORIES_DETAILS: 'item_categories_details',
  MASTER_ITEMS: 'master_items',
  MASTER_CATEGORIES: 'master_categories',
  CATEGORIES: 'categories',
  TYPE_CATEGORIES: 'type_categories',
  DOKUMEN: 'dokumen'
};

const RAW_FALSE = db.raw('false');

let tempKeyCounter = 0;
const generateTempKey = () => `__temp_${Date.now()}_${tempKeyCounter++}`;

const buildKey = (primaryValue, fallbackValues = []) => {
  if (primaryValue) {
    return primaryValue;
  }
  const fallback = fallbackValues.filter(Boolean).join('|');
  if (fallback) {
    return fallback;
  }
  return generateTempKey();
};

const mergeItemDetailData = (details = []) => {
  const map = new Map();

  details.forEach((detail) => {
    if (!detail) {
      return;
    }
    const key = buildKey(
      detail.item_category_detail_id,
      [detail.part_number, detail.catalog_item_name_en, detail.catalog_item_name_ch]
    );
    if (!map.has(key)) {
      map.set(key, { ...detail });
    }
  });

  return Array.from(map.values());
};

const mergeItemData = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    if (!item) {
      return;
    }

    const key = buildKey(
      item.item_category_id,
      [item.item_category_name_en, item.item_category_name_cn, item.item_category_foto]
    );
    const normalizedDetails = mergeItemDetailData(item.item_detail_data || []);

    if (map.has(key)) {
      const existing = map.get(key);
      existing.item_detail_data = mergeItemDetailData([
        ...(existing.item_detail_data || []),
        ...normalizedDetails
      ]);
    } else {
      map.set(key, {
        ...item,
        item_detail_data: normalizedDetails
      });
    }
  });

  return Array.from(map.values());
};

const mergeTypeData = (types = []) => {
  const map = new Map();

  types.forEach((type) => {
    if (!type) {
      return;
    }

    const key = buildKey(
      type.type_category_id,
      [type.type_category_code, type.type_category_name_en, type.type_category_name_cn]
    );
    const normalizedItems = mergeItemData(type.item_data || []);

    if (map.has(key)) {
      const existing = map.get(key);
      existing.item_data = mergeItemData([
        ...(existing.item_data || []),
        ...normalizedItems
      ]);
    } else {
      map.set(key, {
        ...type,
        item_data: normalizedItems
      });
    }
  });

  return Array.from(map.values());
};

const mergeCategoryData = (categories = []) => {
  const map = new Map();

  categories.forEach((category) => {
    if (!category) {
      return;
    }

    const key = buildKey(
      category.category_id,
      [category.categories_code, category.category_name_en, category.category_name_cn]
    );
    const normalizedSub = mergeTypeData(category.sub_data || []);

    if (map.has(key)) {
      const existing = map.get(key);
      existing.sub_data = mergeTypeData([
        ...(existing.sub_data || []),
        ...normalizedSub
      ]);
    } else {
      map.set(key, {
        ...category,
        sub_data: normalizedSub
      });
    }
  });

  return Array.from(map.values());
};

const mergeMasterData = (masterData = []) => {
  const map = new Map();

  masterData.forEach((master) => {
    if (!master) {
      return;
    }

    const key = buildKey(
      master.master_category_id,
      [master.master_category_name_en, master.master_category_name_cn]
    );
    const normalizedCategories = mergeCategoryData(master.category_data || []);

    if (map.has(key)) {
      const existing = map.get(key);
      existing.category_data = mergeCategoryData([
        ...(existing.category_data || []),
        ...normalizedCategories
      ]);
    } else {
      map.set(key, {
        ...master,
        category_data: normalizedCategories
      });
    }
  });

  return Array.from(map.values());
};

const SELECT_FIELDS = [
  db.raw('COALESCE(mc_type.master_category_id, mc_direct.master_category_id) as master_category_id'),
  db.raw('COALESCE(mc_type.master_category_name_en, mc_direct.master_category_name_en) as master_category_name_en'),
  db.raw('COALESCE(mc_type.master_category_name_cn, mc_direct.master_category_name_cn) as master_category_name_cn'),
  db.raw('COALESCE(c_direct.category_id, c_type.category_id) as category_id'),
  db.raw('COALESCE(c_direct.categories_code, c_type.categories_code) as categories_code'),
  db.raw('COALESCE(c_direct.category_name_en, c_type.category_name_en) as category_name_en'),
  db.raw('COALESCE(c_direct.category_name_cn, c_type.category_name_cn) as category_name_cn'),
  'tc.type_category_id',
  'tc.type_category_name_en',
  'tc.type_category_name_cn',
  'tc.type_category_code',
  'ic.item_category_id',
  'ic.item_category_name_en',
  'ic.item_category_name_cn',
  'ic.item_category_foto',
  'icd.item_category_detail_id',
  'mi.part_number',
  db.raw('mi.master_item_name_en as catalog_item_name_en'),
  db.raw('mi.master_item_name_ch as catalog_item_name_ch'),
  db.raw('COALESCE(mc_type.created_at, mc_direct.created_at) as created_at')
];

const sanitizePagination = (page, limit) => {
  let sanitizedPage = parseInt(page, 10);
  if (Number.isNaN(sanitizedPage) || sanitizedPage < 1) {
    sanitizedPage = 1;
  }

  let sanitizedLimit = parseInt(limit, 10);
  if (Number.isNaN(sanitizedLimit) || sanitizedLimit < 1) {
    sanitizedLimit = 10;
  }

  if (sanitizedLimit > 100) {
    sanitizedLimit = 100;
  }

  return {
    page: sanitizedPage,
    limit: sanitizedLimit
  };
};

const paginateArray = (items, page, limit) => {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
  const offset = (safePage - 1) * safeLimit;
  const paginatedItems = items.slice(offset, offset + safeLimit);
  const total = items.length;

  return {
    data: paginatedItems,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit)
    }
  };
};

const formatMasterData = (rows) => {
  const masterMap = new Map();

  rows.forEach((row) => {
    const categoryKey = row.category_id || row.type_category_id || row.item_category_id;
    if (!categoryKey) {
      return;
    }

    const typeKey = row.type_category_id || row.item_category_id || `type-${categoryKey}`;
    const masterKey = row.master_category_id || `master-${categoryKey}`;
    const itemKey = row.item_category_id || null;

    let masterEntry = masterMap.get(masterKey);
    if (!masterEntry) {
      masterEntry = {
        master_category_id: row.master_category_id || null,
        master_category_name_en: row.master_category_name_en || null,
        master_category_name_cn: row.master_category_name_cn || null,
        created_at: row.created_at || null,
        category_data: [],
        __categoryMap: new Map()
      };
      masterMap.set(masterKey, masterEntry);
    }

    let categoryEntry = masterEntry.__categoryMap.get(categoryKey);
    if (!categoryEntry) {
      categoryEntry = {
        category_id: row.category_id || null,
        categories_code: row.categories_code || null,
        category_name_en: row.category_name_en || null,
        category_name_cn: row.category_name_cn || null,
        sub_data: [],
        __typeMap: new Map()
      };
      masterEntry.__categoryMap.set(categoryKey, categoryEntry);
      masterEntry.category_data.push(categoryEntry);
    }

    if (!typeKey) {
      return;
    }

    let typeEntry = categoryEntry.__typeMap.get(typeKey);
    if (!typeEntry) {
      typeEntry = {
        type_category_id: row.type_category_id || null,
        type_category_name_en: row.type_category_name_en || null,
        type_category_name_cn: row.type_category_name_cn || null,
        type_category_code: row.type_category_code || null,
        item_data: [],
        __itemMap: new Map()
      };
      categoryEntry.__typeMap.set(typeKey, typeEntry);
      categoryEntry.sub_data.push(typeEntry);
    }

    if (!itemKey) {
      return;
    }

    let itemEntry = typeEntry.__itemMap.get(itemKey);
    if (!itemEntry) {
      itemEntry = {
        item_category_id: row.item_category_id || null,
        item_category_name_en: row.item_category_name_en || null,
        item_category_name_cn: row.item_category_name_cn || null,
        item_category_foto: row.item_category_foto || null,
        item_detail_data: [],
        __detailSet: new Set()
      };
      typeEntry.__itemMap.set(itemKey, itemEntry);
      typeEntry.item_data.push(itemEntry);
    }

    if (row.item_category_detail_id && !itemEntry.__detailSet.has(row.item_category_detail_id)) {
      itemEntry.__detailSet.add(row.item_category_detail_id);
      itemEntry.item_detail_data.push({
        item_category_detail_id: row.item_category_detail_id,
        part_number: row.part_number || null,
        catalog_item_name_en: row.catalog_item_name_en || null,
        catalog_item_name_ch: row.catalog_item_name_ch || null
      });
    }
  });

  const masterArray = Array.from(masterMap.values()).map((master) => {
    master.category_data.forEach((category) => {
      category.sub_data.forEach((type) => {
        type.item_data.forEach((item) => {
          delete item.__detailSet;
        });
        delete type.__itemMap;
      });
      delete category.__typeMap;
    });
    delete master.__categoryMap;
    return master;
  });

  return mergeMasterData(masterArray);
};

const extractCategoryData = (masterData) => {
  const categories = [];

  masterData.forEach((master) => {
    master.category_data.forEach((category) => {
      categories.push({
        ...category,
        sub_data: mergeTypeData(category.sub_data || [])
      });
    });
  });

  return mergeCategoryData(categories);
};

const extractTypeData = (masterData) => {
  const types = [];

  masterData.forEach((master) => {
    master.category_data.forEach((category) => {
      category.sub_data.forEach((type) => {
        types.push({
          ...type,
          item_data: mergeItemData(type.item_data || [])
        });
      });
    });
  });

  return mergeTypeData(types);
};

const extractItemData = (masterData) => {
  const items = [];

  masterData.forEach((master) => {
    master.category_data.forEach((category) => {
      category.sub_data.forEach((type) => {
        type.item_data.forEach((item) => {
          items.push({
            ...item,
            item_detail_data: mergeItemDetailData(item.item_detail_data || [])
          });
        });
      });
    });
  });

  return mergeItemData(items);
};

const searchByVinNumber = async (dataCode, pagination) => {
  const product = await db(TABLES.PRODUCTS)
    .select('product_id')
    .where('vin_number', dataCode)
    .whereNull('deleted_at')
    .where('is_delete', false)
    .first();

  if (!product) {
    return null;
  }

  const rows = await db({ p: TABLES.PRODUCTS })
    .select(SELECT_FIELDS)
    .leftJoin({ pd: TABLES.PRODUCTS_DETAILS }, function () {
      this.on('p.product_id', '=', 'pd.product_id')
        .andOnNull('pd.deleted_at')
        .andOn('pd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function () {
      this.on('pd.dokumen_id', '=', 'ic.dokumen_id')
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function () {
      this.on('ic.type_category_id', '=', 'tc.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function () {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function () {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function () {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function () {
      this.on('icd.master_item_id', '=', 'mi.master_item_id')
        .andOnNull('mi.deleted_at')
        .andOn('mi.is_delete', '=', RAW_FALSE);
    })
    .where('p.product_id', product.product_id)
    .whereNull('p.deleted_at')
    .where('p.is_delete', false);

  const masterData = formatMasterData(rows);
  const { data, pagination: meta } = paginateArray(masterData, pagination.page, pagination.limit);

  return {
    type_data: 'vin_number',
    item: data,
    pagination: meta
  };
};

const searchByCategoryCode = async (dataCode, pagination) => {
  const rows = await db({ c_direct: TABLES.CATEGORIES })
    .select(SELECT_FIELDS)
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function () {
      this.on('tc.category_id', '=', 'c_direct.category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function () {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function () {
      this.on(function () {
        this.on('ic.type_category_id', '=', 'tc.type_category_id')
          .orOn('ic.category_id', '=', 'c_direct.category_id');
      })
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function () {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function () {
      this.on('icd.master_item_id', '=', 'mi.master_item_id')
        .andOnNull('mi.deleted_at')
        .andOn('mi.is_delete', '=', RAW_FALSE);
    })
    .where('c_direct.categories_code', dataCode)
    .whereNull('c_direct.deleted_at')
    .where('c_direct.is_delete', false);

  if (rows.length === 0) {
    return null;
  }

  const masterData = formatMasterData(rows);
  const categories = extractCategoryData(masterData);
  const { data, pagination: meta } = paginateArray(categories, pagination.page, pagination.limit);

  return {
    type_data: 'part_number_1',
    category_data: data,
    pagination: meta
  };
};

const buildTypeCategoryQuery = (filterCallback) => {
  const query = db({ tc: TABLES.TYPE_CATEGORIES })
    .select(SELECT_FIELDS)
    .leftJoin({ c_type: TABLES.CATEGORIES }, function () {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function () {
      this.on(function () {
        this.on('ic.type_category_id', '=', 'tc.type_category_id')
          .orOn('ic.category_id', '=', 'c_type.category_id');
      })
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function () {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function () {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function () {
      this.on('icd.master_item_id', '=', 'mi.master_item_id')
        .andOnNull('mi.deleted_at')
        .andOn('mi.is_delete', '=', RAW_FALSE);
    })
    .whereNull('tc.deleted_at')
    .where('tc.is_delete', false);

  if (typeof filterCallback === 'function') {
    filterCallback(query);
  }

  return query;
};

const searchByTypeCategory = async (dataCode, pagination) => {
  let rows = await buildTypeCategoryQuery((query) =>
    query.where('tc.type_category_code', dataCode)
  );

  if (rows.length === 0) {
    rows = await buildTypeCategoryQuery((query) =>
      query.where('tc.type_category_name_en', 'ilike', `%${dataCode}%`)
    );

    if (rows.length === 0) {
      return null;
    }
  }

  const masterData = formatMasterData(rows);
  const types = extractTypeData(masterData);
  const { data, pagination: meta } = paginateArray(types, pagination.page, pagination.limit);

  return {
    type_data: 'part_number_2',
    sub_data: data,
    pagination: meta
  };
};

const searchByMasterItemPartNumber = async (dataCode, pagination) => {
  const rows = await db({ mi: TABLES.MASTER_ITEMS })
    .select(SELECT_FIELDS)
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function () {
      this.on('mi.master_item_id', '=', 'icd.master_item_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function () {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function () {
      this.on('ic.type_category_id', '=', 'tc.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function () {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function () {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .where('mi.part_number', dataCode)
    .whereNull('mi.deleted_at')
    .where('mi.is_delete', false);

  if (rows.length === 0) {
    return null;
  }

  const masterData = formatMasterData(rows);
  const items = extractItemData(masterData);
  const { data, pagination: meta } = paginateArray(items, pagination.page, pagination.limit);

  return {
    type_data: 'part_number_3',
    item_data: data,
    pagination: meta
  };
};

const searchByVinWithCustomerCheck = async (search, customerId, pagination) => {
  // Build Query for Products (Simple Query)
  const simpleQuery = db(TABLES.PRODUCTS)
    .whereNull('deleted_at')
    .where('is_delete', false);

  if (search && String(search).trim() !== '') {
    const searchTerm = `%${String(search).trim()}%`;
    simpleQuery.where(function () {
      this.where('vin_number', 'ilike', searchTerm)
        .orWhere('body_number', 'ilike', searchTerm);
    });
  }

  if (pagination.status && String(pagination.status).trim() !== '') {
    simpleQuery.where('status', pagination.status);
  }

  if (customerId && customerId !== '' && customerId !== 'NaN' && customerId !== 'null' && customerId !== null) {
    simpleQuery.whereIn('product_id', function () {
      this.select('product_id')
        .from(TABLES.VIN_CUSTOMERS)
        .where('customer_id', customerId);
    });
  }

  // Count
  const countResult = await simpleQuery.clone().count('product_id as total').first();
  const total = parseInt(countResult.total, 10) || 0;

  // Dblink for updated_by_name
  const dblinkReady = await setupDblink();
  if (dblinkReady) {
    const dblinkSubquery = db.raw(`
      dblink('gate_sso_conn', 
        'SELECT 
          c.customer_id::text, 
          c.customer_name 
        FROM customers c 
        WHERE c.is_delete = false'
      ) AS customer_data(customer_id text, customer_name varchar)
    `);

    simpleQuery
      .select(`${TABLES.PRODUCTS}.*`, db.raw('customer_data.customer_name as updated_by_name'))
      .leftJoin(dblinkSubquery, function () {
        this.on(db.raw(`${TABLES.PRODUCTS}.updated_by::text`), '=', db.raw('customer_data.customer_id'));
      });
  } else {
    simpleQuery.select(`${TABLES.PRODUCTS}.*`, db.raw('NULL::varchar as updated_by_name'));
  }

  // Sorting
  if (pagination.sortBy && pagination.sortOrder) {
    // If sort by updated_by_name, map to customer_name from dblink or ignore
    if (pagination.sortBy === 'updated_by_name') {
      if (dblinkReady) {
        simpleQuery.orderBy(db.raw('customer_data.customer_name'), pagination.sortOrder);
      } else {
        simpleQuery.orderBy('created_at', 'desc');
      }
    } else {
      simpleQuery.orderBy(pagination.sortBy, pagination.sortOrder);
    }
  } else {
    simpleQuery.orderBy('created_at', 'desc');
  }

  // Pagination
  simpleQuery.limit(pagination.limit).offset((pagination.page - 1) * pagination.limit);

  const data = await simpleQuery;
  const totalPages = Math.ceil(total / pagination.limit);

  return {
    items: data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages
    }
  };
};

const searchPartsCatalog = async (dataCode, options = {}) => {
  if (!dataCode) {
    return null;
  }

  const trimmedCode = String(dataCode).trim();

  if (!trimmedCode) {
    return null;
  }

  const { page, limit } = sanitizePagination(options.page, options.limit);

  const searchOrder = [
    searchByVinNumber,
    searchByCategoryCode,
    searchByTypeCategory,
    searchByMasterItemPartNumber
  ];

  for (const searchFn of searchOrder) {
    // eslint-disable-next-line no-await-in-loop
    const result = await searchFn(trimmedCode, { page, limit });
    if (result) {
      return result;
    }
  }

  return null;
};

/**
 * Get parts catalog by type_category_id
 * Mengambil data dari parts_catalogs dengan filter type_category_id
 * dan join ke item_categories, item_categories_details, master_items
 */
const getByTypeCategoryId = async (typeCategoryId, options = {}) => {
  if (!typeCategoryId) {
    return null;
  }

  const { page, limit } = sanitizePagination(options.page, options.limit);

  const rows = await buildTypeCategoryQuery((query) =>
    query.where('tc.type_category_id', typeCategoryId)
  );

  if (rows.length === 0) {
    return null;
  }

  const masterData = formatMasterData(rows);
  const types = extractTypeData(masterData);
  const { data, pagination: meta } = paginateArray(types, page, limit);

  return {
    type_data: 'type_category_id',
    sub_data: data,
    pagination: meta
  };
};

/**
 * Build query untuk item category dengan join ke tabel terkait
 */
const buildItemCategoryQuery = (filterCallback) => {
  const query = db({ ic: TABLES.ITEM_CATEGORIES })
    .select(SELECT_FIELDS)
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function () {
      this.on('ic.type_category_id', '=', 'tc.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function () {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function () {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function () {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function () {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function () {
      this.on('icd.master_item_id', '=', 'mi.master_item_id')
        .andOnNull('mi.deleted_at')
        .andOn('mi.is_delete', '=', RAW_FALSE);
    })
    .whereNull('ic.deleted_at')
    .where('ic.is_delete', false);

  if (typeof filterCallback === 'function') {
    filterCallback(query);
  }

  return query;
};

/**
 * Get parts catalog by item_category_id
 * Mengambil data dari parts_catalogs dengan filter item_category_id
 * dan join ke item_categories, item_categories_details, master_items
 */
const getByItemCategoryId = async (itemCategoryId, options = {}) => {
  if (!itemCategoryId) {
    return null;
  }

  const { page, limit } = sanitizePagination(options.page, options.limit);

  const rows = await buildItemCategoryQuery((query) =>
    query.where('ic.item_category_id', itemCategoryId)
  );

  if (rows.length === 0) {
    return null;
  }

  const masterData = formatMasterData(rows);
  const items = extractItemData(masterData);
  const { data, pagination: meta } = paginateArray(items, page, limit);

  return {
    type_data: 'item_category_id',
    item_data: data,
    pagination: meta
  };
};

const getVinCategoryByProductId = async (productId) => {
  const product = await db(TABLES.PRODUCTS)
    .select('product_id', 'vin_number', 'product_name_en', 'product_name_cn', 'product_description')
    .where('product_id', productId)
    .first();

  if (!product) {
    return null;
  }

  const rows = await db({ pd: TABLES.PRODUCTS_DETAILS })
    .select(['mc.master_category_id', 'mc.master_category_name_en'])
    .join({ ic: TABLES.ITEM_CATEGORIES }, 'pd.dokumen_id', '=', 'ic.dokumen_id')
    .join({ c: TABLES.CATEGORIES }, 'c.category_id', '=', 'ic.category_id')
    .join({ mc: TABLES.MASTER_CATEGORIES }, 'mc.master_category_id', '=', 'c.master_category_id')
    .where('pd.product_id', productId)
    .groupBy('mc.master_category_id', 'mc.master_category_name_en');

  const total = rows.length;

  return {
    data_vin: product,
    items: rows,
    pagination: {
      page: 1,
      limit: total || 10,
      total: total,
      totalPages: 1
    }
  };
};

const getVinCategoryByVinNumber = async (vinNumber, customerId) => {
  // 1. Check Product by VIN
  const product = await db(TABLES.PRODUCTS)
    .select('product_id', 'vin_number', 'product_name_en', 'product_name_cn', 'product_description')
    .where('vin_number', vinNumber)
    .whereNull('deleted_at')
    .where('is_delete', false)
    .first();

  if (!product) {
    return null;
  }

  // 2. Check Customer Access (if customerId is provided - though validation makes it mandatory)
  if (customerId) {
    const access = await db(TABLES.VIN_CUSTOMERS)
      .where('product_id', product.product_id)
      .where('customer_id', customerId)
      .first();

    if (!access) {
      throw new Error('Customer tidak memiliki akses ke VIN ini');
    }
  }

  // 3. Fetch Data
  const rows = await db({ pd: TABLES.PRODUCTS_DETAILS })
    .select([
      'mc.master_category_id',
      'mc.master_category_name_en',
      db.raw('array_agg(DISTINCT pd.dokumen_id) as dokumen_ids')
    ])
    .join({ ic: TABLES.ITEM_CATEGORIES }, 'pd.dokumen_id', '=', 'ic.dokumen_id')
    .join({ c: TABLES.CATEGORIES }, 'c.category_id', '=', 'ic.category_id')
    .join({ mc: TABLES.MASTER_CATEGORIES }, 'mc.master_category_id', '=', 'c.master_category_id')
    .where('pd.product_id', product.product_id)
    .groupBy('mc.master_category_id', 'mc.master_category_name_en');


  const formattedRows = rows.map((row) => ({
    ...row,
    dokumen_ids: (row.dokumen_ids || []).map((id) => ({ dokumen_id: id }))
  }));

  const total = rows.length;

  return {
    data_vin: product,
    items: formattedRows,
    pagination: {
      page: 1,
      limit: total || 10,
      total: total,
      totalPages: 1
    }
  };
};


const getCategoriesByMasterCategoryId = async (masterCategoryId, options = {}) => {
  const {
    search,
    page,
    limit,
    sortBy = 'created_at',
    sortOrder = 'desc',
    productId,
    customerId,
    dokumenIds
  } = options;

  if (productId && customerId) {
    const checkProduct = await db(TABLES.VIN_CUSTOMERS)
      .where('product_id', productId)
      .where('customer_id', customerId)
      .first();

    if (!checkProduct) {
      throw new Error('Validasi gagal: Product ID dan Customer ID tidak cocok atau tidak ditemukan');
    }
  }

  const baseQuery = db({ c: TABLES.CATEGORIES })
    .select(
      'icd.item_category_id',
      'c.category_id',
      'c.category_name_en',
      'c.category_name_cn',
      'c.category_description',
      'c.created_at',
      'tc.type_category_id',
      'tc.type_category_name_en',
      'tc.type_category_name_cn',
      'd.dokumen_name'
    )
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, 'ic.category_id', 'c.category_id')
    .leftJoin({ d: TABLES.DOKUMEN }, 'd.dokumen_id', 'ic.dokumen_id')
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, 'tc.type_category_id', 'ic.type_category_id')
    .join({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, 'icd.item_category_id', 'ic.item_category_id')
    .join({ mi: TABLES.MASTER_ITEMS }, 'mi.master_item_id', 'icd.master_item_id')
    .whereNull('c.deleted_at')
    .where('c.is_delete', false);

  if (dokumenIds && Array.isArray(dokumenIds) && dokumenIds.length > 0) {
    baseQuery.whereIn('ic.dokumen_id', dokumenIds);
  } else if (masterCategoryId) {
    baseQuery.where('c.master_category_id', masterCategoryId);

    if (masterCategoryId === '1e30e77b-1663-47d9-9cb0-67531c831516' && productId) {
      baseQuery
        .join({ pd: TABLES.PRODUCTS_DETAILS }, 'pd.dokumen_id', 'ic.dokumen_id')
        .where('pd.product_id', productId)
        .whereNull('pd.deleted_at')
        .where('pd.is_delete', false);
    }
  }

  if (search) {
    baseQuery.where(function () {
      this.where('c.category_name_en', 'ilike', `%${search}%`)
        .orWhere('c.category_name_cn', 'ilike', `%${search}%`)
        .orWhere('tc.type_category_name_en', 'ilike', `%${search}%`)
        .orWhere('tc.type_category_name_cn', 'ilike', `%${search}%`)
        .orWhere('c.category_description', 'ilike', `%${search}%`)
        .orWhere('mi.part_number', 'ilike', `%${search}%`)
        .orWhere('mi.master_item_name_en', 'ilike', `%${search}%`)
        .orWhere('mi.master_item_name_ch', 'ilike', `%${search}%`)
        .orWhere('mi.description', 'ilike', `%${search}%`);
    });
  }

  // Group by to avoid duplicates from joins
  baseQuery.groupBy(
    'icd.item_category_id',
    'c.master_category_id',
    'c.category_id',
    'c.category_name_en',
    'c.category_name_cn',
    'c.category_description',
    'c.created_at',
    'tc.type_category_id',
    'tc.type_category_name_en',
    'tc.type_category_name_cn',
    'd.dokumen_name'
  );

  // Count total for pagination (using countDistinct to handle joins)
  // We need to clone before applying limit/offset, but after filters and joins.
  // Note: baseQuery already has groupBy, which might interfere with simple count. 
  // We'll create a separate count query or modify the clone.
  const countQuery = db({ c: TABLES.CATEGORIES })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, 'ic.category_id', 'c.category_id')
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, 'tc.type_category_id', 'ic.type_category_id')
    .join({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, 'icd.item_category_id', 'ic.item_category_id')
    .join({ mi: TABLES.MASTER_ITEMS }, 'mi.master_item_id', 'icd.master_item_id')
    .whereNull('c.deleted_at')
    .where('c.is_delete', false);

  if (dokumenIds && Array.isArray(dokumenIds) && dokumenIds.length > 0) {
    countQuery.whereIn('ic.dokumen_id', dokumenIds);
  } else if (masterCategoryId) {
    countQuery.where('c.master_category_id', masterCategoryId);

    if (masterCategoryId === '1e30e77b-1663-47d9-9cb0-67531c831516' && productId) {
      countQuery
        .join({ pd: TABLES.PRODUCTS_DETAILS }, 'pd.dokumen_id', 'ic.dokumen_id')
        .where('pd.product_id', productId)
        .whereNull('pd.deleted_at')
        .where('pd.is_delete', false);
    }
  }

  if (search) {
    countQuery.where(function () {
      this.where('c.category_name_en', 'ilike', `%${search}%`)
        .orWhere('c.category_name_cn', 'ilike', `%${search}%`)
        .orWhere('tc.type_category_name_en', 'ilike', `%${search}%`)
        .orWhere('tc.type_category_name_cn', 'ilike', `%${search}%`)
        .orWhere('c.category_description', 'ilike', `%${search}%`)
        .orWhere('mi.part_number', 'ilike', `%${search}%`);
    });
  }

  // The baseQuery groups by item_category_id (among others), so we count distinct item_category_id
  const countResult = await countQuery.countDistinct('ic.item_category_id as total').first();
  const total = parseInt(countResult ? countResult.total : 0, 10);

  // Apply sorting
  baseQuery.orderBy(sortBy, sortOrder);

  // Apply pagination
  const { page: safePage, limit: safeLimit } = sanitizePagination(page, limit);

  if (limit !== 1000) {
    const offset = (safePage - 1) * safeLimit;
    baseQuery.limit(safeLimit).offset(offset);
  }

  const items = await baseQuery;

  // Grouping items by category_id
  const groupedItems = Object.values(
    items.reduce((acc, current) => {
      const { category_id } = current;
      if (!acc[category_id]) {
        acc[category_id] = {
          id: category_id,
          id_link: null,
          name: current.category_name_en,
          name_cn: current.category_name_cn,
          description: current.category_description,
          child: []
        };
      }

      if (current.type_category_id) {
        acc[category_id].child.push({
          id: current.type_category_id,
          id_link: current.item_category_id,
          name: current.type_category_name_en,
          name_cn: current.type_category_name_cn,
          description: null,
          child: []
        });
      } else {
        acc[category_id].id_link = current.item_category_id;
      }

      return acc;
    }, {})
  );

  return {
    items: groupedItems,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit)
    }
  };
};

const updateProduct = async (productId, data, userId) => {
  const existingProduct = await db(TABLES.PRODUCTS)
    .where('product_id', productId)
    .whereNull('deleted_at')
    .where('is_delete', false)
    .first();

  if (!existingProduct) {
    throw new Error('Product not found');
  }

  const updateData = {
    ...data,
    updated_at: db.fn.now(),
    updated_by: userId
  };

  const [updatedProduct] = await db(TABLES.PRODUCTS)
    .where('product_id', productId)
    .update(updateData)
    .returning('*');

  return updatedProduct;
};

const getProductById = async (productId) => {
  const product = await db(TABLES.PRODUCTS)
    .where('product_id', productId)
    .whereNull('deleted_at')
    .where('is_delete', false)
    .first();

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

const getItemDetailsByItemCategoryId = async (itemCategoryId) => {
  // Query 1: Get data items
  const items = await db({ icd: TABLES.ITEM_CATEGORIES_DETAILS })
    .join({ mi: TABLES.MASTER_ITEMS }, 'mi.master_item_id', 'icd.master_item_id')
    .select(
      'icd.item_category_detail_id',
      'icd.target_id',
      'mi.master_item_id',
      'icd.quantity as quantity_needs',
      'mi.quantity as quantity_stock',
      'mi.master_item_name_en',
      'mi.master_item_name_ch',
      'mi.part_number',
      'mi.description'
    )
    .where('icd.item_category_id', itemCategoryId);

  // Query 2: Get data header item
  const header = await db({ ic: TABLES.ITEM_CATEGORIES })
    .join({ c: TABLES.CATEGORIES }, 'c.category_id', 'ic.category_id')
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, 'tc.type_category_id', 'ic.type_category_id')
    .select(
      'ic.item_category_foto',
      'c.category_name_en',
      'c.category_name_cn',
      'tc.type_category_name_cn',
      'tc.type_category_name_en'
    )
    .where('ic.item_category_id', itemCategoryId)
    .first();

  if (!header) {
    throw new Error('Data tidak ditemukan');
  }

  return {
    header,
    items
  };
};


module.exports = {
  searchPartsCatalog,
  searchByVinWithCustomerCheck,
  getByTypeCategoryId,
  getByItemCategoryId,
  getVinCategoryByProductId,
  getVinCategoryByVinNumber,
  getCategoriesByMasterCategoryId,
  updateProduct,
  getProductById,
  getItemDetailsByItemCategoryId
};

