const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool for Neon.
// SSL handled entirely via the DATABASE_URL connection string.
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pgPool.on('connect', () => {
  console.log('[DB] Connected to Neon PostgreSQL');
});

pgPool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

/**
 * MySQL2-compatibility wrapper.
 * mysql2 returns: [rows, fields]
 * pg returns:     { rows, fields }
 *
 * This wrapper converts ? placeholders to $1, $2, etc.
 * and returns [rows, fields] so all existing code works unchanged.
 */
const pool = {
  query: async (sql, params) => {
    let i = 0;
    let pgSql = sql.replace(/\?/g, () => `$${++i}`);
    pgSql = pgSql.replace(/`([^`]+)`/g, '"$1"');

    const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
    const isUpdateDelete = sql.trim().toUpperCase().startsWith('UPDATE') || sql.trim().toUpperCase().startsWith('DELETE');

    if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
      pgSql += ' RETURNING id';
    }

    const result = await pgPool.query(pgSql, params);

    if (isInsert || isUpdateDelete) {
      const mockResult = {
        insertId: isInsert && result.rows[0] ? result.rows[0].id : null,
        affectedRows: result.rowCount,
        warningCount: 0,
        message: '',
      };
      return [mockResult, result.fields];
    }

    return [result.rows, result.fields];
  },
  getConnection: async () => {
    const client = await pgPool.connect();
    return {
      query: async (sql, params) => {
        let i = 0;
        let pgSql = sql.replace(/\?/g, () => `$${++i}`);
        pgSql = pgSql.replace(/`([^`]+)`/g, '"$1"');

        const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
        const isUpdateDelete = sql.trim().toUpperCase().startsWith('UPDATE') || sql.trim().toUpperCase().startsWith('DELETE');

        if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
          pgSql += ' RETURNING id';
        }

        const result = await client.query(pgSql, params);

        if (isInsert || isUpdateDelete) {
          const mockResult = {
            insertId: isInsert && result.rows[0] ? result.rows[0].id : null,
            affectedRows: result.rowCount,
            warningCount: 0,
            message: '',
          };
          return [mockResult, result.fields];
        }

        return [result.rows, result.fields];
      },
      release: () => client.release(),
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
    };
  },
  end: async () => pgPool.end(),
};

console.log('[DB] Neon PostgreSQL pool initialized');

module.exports = { pool };
