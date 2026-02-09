const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const schemaPath = path.join(__dirname, 'doctor_schema.mysql.sql');

async function setupDatabase() {
  let connection;
  try {
    // Connect to MySQL server without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database '${process.env.DB_NAME}' created or already exists.`);

    // Use the database
    await connection.changeUser({ database: process.env.DB_NAME });

    // Read schema file
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Run schema
    console.log('Running schema script...');
    await connection.query(schema);
    console.log('Schema executed successfully.');

    // Create uploads directory
    const uploadsDir = path.join(__dirname, '../../uploads/reports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Uploads directory created.');
    }

  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setupDatabase();
