#!/usr/bin/env node
/**
 * Clinixa Database Utilities
 * Consolidated script for all database operations
 * 
 * Usage:
 *   node db-utils.js setup [--seed]       - Setup database with schema (and seed data)
 *   node db-utils.js cloud-setup [--seed] - Setup cloud database (uses pool config)
 *   node db-utils.js reset                - Drop and recreate database
 *   node db-utils.js clean                - Drop all tables
 *   node db-utils.js list                 - List all tables
 *   node db-utils.js inspect <table>      - Show columns of a table
 *   node db-utils.js query "<sql>"        - Execute a query
 *   node db-utils.js patch                - Add missing columns
 *   node db-utils.js test                 - Test database connection and queries
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');
require('dotenv').config();

const SCHEMA_FILE = path.join(__dirname, 'schema.pg.sql');
const SEED_FILE = path.join(__dirname, 'seed.pg.sql');


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function runSQLFile(connection, filePath, description, multiStatement = false) {
    console.log(`\n📄 Running ${description}...`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return;
    }

    const sql = fs.readFileSync(filePath, 'utf8');

    if (multiStatement) {
        // Split and execute individually
        const queries = sql
            .replace(/--.*?\n/g, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0);

        console.log(`  🚀 Found ${queries.length} queries to execute`);

        for (let i = 0; i < queries.length; i++) {
            try {
                await connection.query(queries[i]);
            } catch (err) {
                if (!queries[i].toUpperCase().includes('DROP TABLE')) {
                    console.error(`  ❌ Error in query ${i + 1}:`, err.message);
                    throw err;
                }
            }
        }
    } else {
        // Execute as single statement
        await connection.query(sql);
    }

    console.log(`  ✅ Successfully executed ${description}`);
}

// ============================================================================
// DATABASE SETUP (Local)
// ============================================================================

async function setupDatabase() {
    const shouldSeed = process.argv.includes('--seed');
    let connection;

    try {
        console.log('🏥 Clinixa Hospital Database Setup');
        console.log('===================================');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('\n✅ Connected to MySQL server');

        const dbName = process.env.DB_NAME || 'hospital_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
        console.log(`✅ Using database: ${dbName}`);

        await runSQLFile(connection, SCHEMA_FILE, 'Schema (schema.sql)');

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

// ============================================================================
// CLOUD DATABASE SETUP
// ============================================================================

async function cloudSetup() {
    const shouldSeed = process.argv.includes('--seed');

    console.log('\n🏥 Clinixa Cloud Database Setup');
    console.log('===================================');

    let connection;
    try {
        connection = await pool.getConnection();
        console.log('✅ Connected to Cloud Database (SSL Enabled)');

        // In PostgreSQL, we don't usually need to disable foreign key checks for fresh table creation.
        // If needed, the equivalent is "SET session_replication_role = 'replica';" (requires superuser)
        // or dropping constraints. For now, we'll just skip the MySQL command.

        await runSQLFile(connection, SCHEMA_FILE, 'Schema', true);

        if (shouldSeed) {
            await runSQLFile(connection, SEED_FILE, 'Seed Data', true);
        }

        console.log('\n🎉 Cloud setup complete!');
    } catch (err) {
        console.error('\n❌ Setup failed:', err.message);
    } finally {
        if (connection) connection.release();
        await pool.end();
        process.exit(0);
    }
}

// ============================================================================
// RESET DATABASE
// ============================================================================

async function resetDatabase() {
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
        console.log('👉 Now run: node db-utils.js setup --seed');

    } catch (err) {
        console.error('❌ Reset failed:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

// ============================================================================
// CLEAN DATABASE (Drop all tables)
// ============================================================================

async function cleanDatabase() {
    console.log('[Clean] Starting database cleanup...');
    let connection;

    try {
        connection = await pool.getConnection();

        const tables = [
            'admin_notifications',
            'tokens',
            'payments',
            'invoices',
            'lab_reports',
            'medicines',
            'prescriptions',
            'appointments',
            'patients',
            'doctors',
            'departments',
            'users'
        ];

        for (const table of tables) {
            try {
                console.log(`[Clean] Dropping table: ${table}`);
                await connection.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
            } catch (err) {
                console.warn(`[Clean] Could not drop ${table}: ${err.message}`);
            }
        }

        console.log('[Clean] Cleanup completed.');
    } catch (error) {
        console.error('[Clean] Error:', error.message);
    } finally {
        if (connection) connection.release();
        await pool.end();
        process.exit();
    }
}

// ============================================================================
// LIST TABLES
// ============================================================================

async function listTables() {
    console.log('\n📋 Listing all tables in database...');
    try {
        const [rows] = await pool.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
        );

        if (rows.length === 0) {
            console.log('∅ No tables found.');
        } else {
            rows.forEach((row, i) => {
                console.log(`${i + 1}. ${row.tablename}`);
            });
        }
    } catch (err) {
        console.error('❌ Failed to list tables:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

async function inspectTable(tableName) {
    if (!tableName) {
        console.error('[Error] Please specify a table name.');
        process.exit(1);
    }
    console.log(`[Info] Inspecting table: ${tableName}`);
    try {
        const [rows] = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = $1
            ORDER BY ordinal_position
        `, [tableName]);
        console.table(rows);
    } catch (err) {
        console.error('[Error]:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

async function runQuery(sql) {
    if (!sql) {
        console.error('[Error] Please specify a SQL query.');
        process.exit(1);
    }
    console.log(`[Info] Running query: ${sql}`);
    try {
        const [rows] = await pool.query(sql);
        console.table(rows);
    } catch (err) {
        console.error('[Error]:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

// ============================================================================
// PATCH SCHEMA
// ============================================================================

async function patchSchema() {
    console.log('[Patch] Updating database schema...');
    try {
        // 1. Add missing columns to appointments
        try {
            await pool.query('ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reason TEXT');
            console.log('✅ Ensured "reason" column exists in appointments');
        } catch (err) {
            console.warn(`   ⚠️ Appointments column: ${err.message}`);
        }

        // 8. List users for verification
        const [users] = await pool.query('SELECT name, email, role, status FROM users LIMIT 10');
        console.log(`\n[Info] Found users in database:`);
        users.forEach(u => console.log(`   - ${u.name} (${u.email}) [${u.role}]`));

    } catch (err) {
        console.error('[Patch] FAIL:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

// ============================================================================
// TEST DATABASE
// ==================================================

async function testDatabase() {
    console.log('[Test] Environment Check:');
    console.log(` - DATABASE_URL: ${process.env.DATABASE_URL ? 'DEFINED' : 'MISSING'}`);

    console.log('\n[Test] Testing DB connection...');
    try {
        const [dbInfo] = await pool.query('SELECT current_database() as db, current_user as user, version() as ver');
        console.log(`[Test] Connection Info: ${JSON.stringify(dbInfo[0])}`);

        const [tables] = await pool.query("SELECT COUNT(*) as count FROM pg_tables WHERE schemaname = 'public'");
        console.log(`[Test] Found ${tables[0].count} tables`);

        // Test departments query
        console.log('\n[Test] Testing departments query...');
        try {
            const [rows] = await pool.query(`
                SELECT 
                    d.id,
                    d.name,
                    d.head,
                    d.beds,
                    d.status,
                    COUNT(doc.id) as doctor_count
                FROM departments d
                LEFT JOIN doctors doc ON doc.department_id = d.id
                GROUP BY d.id, d.name, d.head, d.beds, d.status
                ORDER BY d.name
            `);
            console.log(`[Test] ✅ Successfully fetched ${rows.length} departments.`);
        } catch (err) {
            console.error(`[Test] ❌ Dept Query FAIL: ${err.message}`);
        }

        // Test doctors query
        console.log('\n[Test] Testing doctors query...');
        try {
            const [rows] = await pool.query(`
                SELECT 
                    u.name,
                    u.email,
                    d.specialization,
                    d.consultation_fee
                FROM doctors d
                JOIN users u ON d.user_id = u.id
                WHERE u.role = 'doctor'
                ORDER BY u.name
            `);
            console.log(`[Test] ✅ Successfully fetched ${rows.length} doctors.`);
        } catch (err) {
            console.error(`[Test] ❌ Doctor Query FAIL: ${err.message}`);
        }

        console.log('\n✅ All tests completed!');
    } catch (err) {
        console.error(`[Test] ❌ Connection FAIL: ${err.message}`);
    } finally {
        await pool.end();
        process.exit();
    }
}

// ============================================================================
// MAIN CLI HANDLER
// ============================================================================

const command = process.argv[2];

switch (command) {
    case 'setup':
        // Setup is combined into cloud-setup for PostgreSQL
        cloudSetup();
        break;
    case 'cloud-setup':
        cloudSetup();
        break;
    case 'reset':
        console.log('Reset not supported on cloud PG without manual drop. Use clean + cloud-setup.');
        process.exit(0);
        break;
    case 'clean':
        cleanDatabase();
        break;
    case 'list':
        listTables();
        break;
    case 'inspect':
        inspectTable(process.argv[3]);
        break;
    case 'query':
        runQuery(process.argv[3]);
        break;
    case 'patch':
        patchSchema();
        break;
    case 'test':
        testDatabase();
        break;
    case 'diagnose':
        diagnoseData();
        break;
    default:
        console.log(`
🏥 Clinixa Database Utilities (PostgreSQL)

Usage:
  node db-utils.js cloud-setup [--seed] - Setup database
  node db-utils.js clean                - Drop all tables
  node db-utils.js list                 - List all tables
  node db-utils.js inspect <table>      - Show columns of a table
  node db-utils.js query "<sql>"        - Execute a query
  node db-utils.js patch                - Patch schema
  node db-utils.js test                 - Test connection
  node db-utils.js diagnose             - Run data health check

Options:
  --seed                                - Include seed data
        `);
        process.exit(0);
}

// ============================================================================
// DATA DIAGNOSTIC
// ============================================================================

async function diagnoseData() {
    console.log('\n🔍 Clinixa Clinical Data Diagnostics');
    console.log('====================================');

    try {
        const [appts] = await pool.query(`
            SELECT a.id, a.date, a.status, 
                   p.id as patient_id, p.name as patient_name,
                   d.id as doctor_id, u.name as doctor_name
            FROM appointments a
            LEFT JOIN patients p ON a.patient_id = p.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            LEFT JOIN users u ON d.user_id = u.id
        `);

        console.log(`\n📊 Appointments Summary:`);
        console.log(`   - Total count: ${appts.length}`);

        const brokenJoins = appts.filter(a => !a.patient_name || !a.doctor_name);
        if (brokenJoins.length > 0) {
            console.warn(`\n⚠️  Found ${brokenJoins.length} inconsistent appointments:`);
            console.table(brokenJoins.map(a => ({
                id: a.id,
                date: a.date ? new Date(a.date).toISOString().split('T')[0] : 'N/A',
                patient: a.patient_name || '-- MISSING --',
                doctor: a.doctor_name || '-- MISSING --'
            })));
        } else {
            console.log(`   ✅ No inconsistent appointments found.`);
        }

        const [counts] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as users,
                (SELECT COUNT(*) FROM doctors) as doctors,
                (SELECT COUNT(*) FROM patients) as patients
        `);
        console.log(`\n📋 Entity Counts:`);
        console.table(counts);

    } catch (err) {
        console.error('\n❌ Diagnosis failed:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}
