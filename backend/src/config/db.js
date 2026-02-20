const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 20, // Increased for team collaboration
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z',
  multipleStatements: true
};

// Add SSL if CA path is provided
if (process.env.DB_SSL_CA_PATH) {
  const caPath = path.resolve(process.env.DB_SSL_CA_PATH);
  if (fs.existsSync(caPath)) {
    poolConfig.ssl = {
      ca: fs.readFileSync(caPath),
      rejectUnauthorized: true
    };
    console.log('[DB] SSL Configuration enabled using:', caPath);
  } else {
    console.warn('[DB] SSL CA path provided but file not found:', caPath);
  }
}

const pool = mysql.createPool(poolConfig);

module.exports = {
  pool,
};
