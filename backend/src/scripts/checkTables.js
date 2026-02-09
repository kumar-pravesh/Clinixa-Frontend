const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTables() {
  let connection;
  try {
    console.log('🔍 Checking database tables...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_db',
      port: process.env.DB_PORT || 3306
    });

    const [users] = await connection.query('SELECT id, role FROM users ORDER BY id');
    console.log(JSON.stringify(users));

    const targets = ['departments', 'doctors', 'patients', 'appointments'];
    const countObj = {};
    for (const t of targets) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as c FROM ${t}`);
        countObj[t] = rows[0].c;
      } catch (e) {
        countObj[t] = 'ERROR: ' + e.message;
      }
    }
    console.log(JSON.stringify(countObj, null, 2));

  } catch (err) {
    console.error('❌ Check failed:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkTables();
