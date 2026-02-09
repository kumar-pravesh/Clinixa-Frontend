/**
 * Reset Database Script
 * DROPS the database and recreates it
 * WARNING: All data will be lost
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function reset() {
  let connection;
  try {
    console.log('⚠️  RESETTING DATABASE...');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    const dbName = process.env.DB_NAME || 'hospital_db';

    console.log(`🗑️  Dropping database: ${dbName}`);
    await connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``);

    console.log(`✨ Recreating database: ${dbName}`);
    await connection.query(`CREATE DATABASE \`${dbName}\``);

    console.log('✅ Database reset successfully!');
    console.log('👉 Now run: npm run db:setup:seed');

  } catch (err) {
    console.error('❌ Reset failed:', err.message);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

reset();
