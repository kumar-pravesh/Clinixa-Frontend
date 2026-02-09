const { pool } = require('./src/config/db');

async function checkSchema(tableName) {
    try {
        const [rows] = await pool.query(`DESCRIBE ${tableName}`);
        console.log(`Schema for table ${tableName}:`, rows);
        process.exit(0);
    } catch (err) {
        console.error(`Error describing table ${tableName}:`, err);
        process.exit(1);
    }
}

const table = process.argv[2] || 'payments';
checkSchema(table);
