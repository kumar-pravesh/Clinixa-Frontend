/**
 * Database Setup Script
 * Runs schema.sql and optionally seed.sql as single multi-statement queries
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SEED_FILE = path.join(__dirname, 'seed.sql');

async function runSQLFile(connection, filePath, description) {
  console.log(`\n📄 Running ${description}...`);

  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    // Execute the entire file content as a single query
    // Requires multipleStatements: true in connection config
    await connection.query(sql);
    console.log(`  ✅ Successfully executed ${description}`);
  } catch (err) {
    console.error(`  ❌ Error executing ${description}:`);
    console.error(err.message);
    // Exit process on error to prevent cascading failures
    process.exit(1);
  }
}

async function setup() {
  let connection;
  const shouldSeed = process.argv.includes('--seed');

  try {
    console.log('🏥 Clinixa Hospital Database Setup');
    console.log('===================================');

    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('\n✅ Connected to MySQL server');

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'hospital_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Using database: ${dbName}`);

    // Run schema
    await runSQLFile(connection, SCHEMA_FILE, 'Schema (schema.sql)');

    // Run seed data if requested
    if (shouldSeed) {
      await runSQLFile(connection, SEED_FILE, 'Seed Data (seed.sql)');
    }

    console.log('\n===================================');
    console.log('🎉 Database setup completed!');
    console.log('===================================');

    if (shouldSeed) {
      console.log('\n📋 Test Credentials (Password: Password@123):');
      console.log('   Admin:        admin@clinixa.life');
      console.log('   Doctor:       rajesh.kumar@clinixa.life');
      console.log('   Receptionist: anjali@clinixa.life');
      console.log('   Lab Tech:     suresh@clinixa.life');
      console.log('   Patient:      john.doe@email.com');
    }

  } catch (err) {
    console.error('\n❌ Setup failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

setup();
