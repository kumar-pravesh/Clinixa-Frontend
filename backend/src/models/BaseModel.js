const { pool } = require('../config/db');

class BaseModel {
    /**
     * Execute a query using the pool or a specific connection (for transactions)
     * @param {string} sql - The SQL query
     * @param {Array} params - Query parameters
     * @param {object} connection - Optional connection object for transactions
     * @returns {Promise<[any, any]>} - Result of the query
     */
    static async query(sql, params, connection = null) {
        const queryExecutor = connection || pool;
        return queryExecutor.query(sql, params);
    }
}

module.exports = BaseModel;
