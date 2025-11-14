const db = require('../../config/database').pgCore;

const TABLES = {
  PRODUCTS: 'products',
  PRODUCTS_DETAILS: 'products_details',
  ITEM_CATEGORIES: 'item_categories',
  ITEM_CATEGORIES_DETAILS: 'item_categories_details',
  MASTER_ITEMS: 'master_items',
  MASTER_CATEGORIES: 'master_categories',
  CATEGORIES: 'categories',
  TYPE_CATEGORIES: 'type_categories'
};

const RAW_FALSE = db.raw('false');

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
  db.raw('mi.master_item_name_ch as catalog_item_name_ch')
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

  return Array.from(masterMap.values()).map((master) => {
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
};

const extractCategoryData = (masterData) => {
  const categories = [];

  masterData.forEach((master) => {
    master.category_data.forEach((category) => {
      categories.push({
        category_id: category.category_id,
        categories_code: category.categories_code,
        category_name_en: category.category_name_en,
        category_name_cn: category.category_name_cn,
        sub_data: category.sub_data
      });
    });
  });

  return categories;
};

const extractTypeData = (masterData) => {
  const types = [];

  masterData.forEach((master) => {
    master.category_data.forEach((category) => {
      category.sub_data.forEach((type) => {
        types.push({
          type_category_id: type.type_category_id,
          type_category_name_en: type.type_category_name_en,
          type_category_name_cn: type.type_category_name_cn,
          type_category_code: type.type_category_code,
          item_data: type.item_data
        });
      });
    });
  });

  return types;
};

const extractItemData = (masterData) => {
  const items = [];

  masterData.forEach((master) => {
    master.category_data.forEach((category) => {
      category.sub_data.forEach((type) => {
        type.item_data.forEach((item) => {
          items.push(item);
        });
      });
    });
  });

  return items;
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
    .leftJoin({ pd: TABLES.PRODUCTS_DETAILS }, function() {
      this.on('p.product_id', '=', 'pd.product_id')
        .andOnNull('pd.deleted_at')
        .andOn('pd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function() {
      this.on('pd.dokumen_id', '=', 'ic.dokumen_id')
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function() {
      this.on('ic.type_category_id', '=', 'tc.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function() {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function() {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function() {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function() {
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
    master_data: data,
    pagination: meta
  };
};

const searchByCategoryCode = async (dataCode, pagination) => {
  const rows = await db({ c_direct: TABLES.CATEGORIES })
    .select(SELECT_FIELDS)
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function() {
      this.on('tc.category_id', '=', 'c_direct.category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function() {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function() {
      this.on(function() {
        this.on('ic.type_category_id', '=', 'tc.type_category_id')
          .orOn('ic.category_id', '=', 'c_direct.category_id');
      })
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function() {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function() {
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
    .leftJoin({ c_type: TABLES.CATEGORIES }, function() {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function() {
      this.on(function() {
        this.on('ic.type_category_id', '=', 'tc.type_category_id')
          .orOn('ic.category_id', '=', 'c_type.category_id');
      })
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function() {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_direct.master_category_id', '=', 'mc_direct.master_category_id')
        .andOnNull('mc_direct.deleted_at')
        .andOn('mc_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function() {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mi: TABLES.MASTER_ITEMS }, function() {
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
    .leftJoin({ icd: TABLES.ITEM_CATEGORIES_DETAILS }, function() {
      this.on('mi.master_item_id', '=', 'icd.master_item_id')
        .andOnNull('icd.deleted_at')
        .andOn('icd.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ ic: TABLES.ITEM_CATEGORIES }, function() {
      this.on('ic.item_category_id', '=', 'icd.item_category_id')
        .andOnNull('ic.deleted_at')
        .andOn('ic.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ tc: TABLES.TYPE_CATEGORIES }, function() {
      this.on('ic.type_category_id', '=', 'tc.type_category_id')
        .andOnNull('tc.deleted_at')
        .andOn('tc.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_type: TABLES.CATEGORIES }, function() {
      this.on('tc.category_id', '=', 'c_type.category_id')
        .andOnNull('c_type.deleted_at')
        .andOn('c_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_type: TABLES.MASTER_CATEGORIES }, function() {
      this.on('c_type.master_category_id', '=', 'mc_type.master_category_id')
        .andOnNull('mc_type.deleted_at')
        .andOn('mc_type.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ c_direct: TABLES.CATEGORIES }, function() {
      this.on('ic.category_id', '=', 'c_direct.category_id')
        .andOnNull('c_direct.deleted_at')
        .andOn('c_direct.is_delete', '=', RAW_FALSE);
    })
    .leftJoin({ mc_direct: TABLES.MASTER_CATEGORIES }, function() {
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

module.exports = {
  searchPartsCatalog
};

