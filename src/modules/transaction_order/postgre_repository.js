const db = require('../../config/database').pgCore;

const TABLE_NAME = 'transaction_orders';

/**
 * Get all transaction orders with pagination, search, and sorting
 */
const findAll = async (options = {}) => {
    const { page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'desc' } = options;
    const offset = (page - 1) * limit;

    const query = db(TABLE_NAME)
        .where({ is_delete: false })
        .whereNull('deleted_at');

    if (search) {
        query.where(function () {
            this.where('transaction_order_no', 'ilike', `%${search}%`)
                .orWhere('transaction_order_description', 'ilike', `%${search}%`)
                .orWhere('transaction_order_status', 'ilike', `%${search}%`);
        });
    }

    // Count total matching records before applying limit/offset
    const [{ count }] = await query.clone().count('transaction_order_id as count');

    // Apply order, limit, and offset
    const data = await query
        .select('*')
        .orderBy(sortBy, sortOrder)
        .limit(limit)
        .offset(offset);

    return {
        items: data,
        pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            total: parseInt(count, 10),
            totalPages: Math.ceil(parseInt(count, 10) / limit)
        }
    };
};

/**
 * Find single transaction order by ID
 */
const findById = async (id) => {
    return await db(TABLE_NAME)
        .select('*')
        .where({ transaction_order_id: id })
        .where({ is_delete: false })
        .whereNull('deleted_at')
        .first();
};

/**
 * Create new transaction order
 */
const create = async (data, userId) => {
    // Prevent manual insertion to let postgres serial handle it
    const insertData = { ...data };
    delete insertData.transaction_order_no;

    const [result] = await db(TABLE_NAME)
        .insert({
            ...insertData,
            created_by: userId,
            updated_by: userId,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
        })
        .returning('*');

    return result;
};


/**
 * Update existing transaction order
 */
const update = async (id, data, userId) => {
    const [result] = await db(TABLE_NAME)
        .where({ transaction_order_id: id })
        .where({ is_delete: false })
        .whereNull('deleted_at')
        .update({
            ...data,
            updated_by: userId,
            updated_at: db.fn.now()
        })
        .returning('*');
    return result;
};

/**
 * Soft delete transaction order
 */
const remove = async (id, userId) => {
    const [result] = await db(TABLE_NAME)
        .where({ transaction_order_id: id })
        .where({ is_delete: false })
        .whereNull('deleted_at')
        .update({
            is_delete: true,
            deleted_by: userId,
            deleted_at: db.fn.now()
        })
        .returning('*');
    return result;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
