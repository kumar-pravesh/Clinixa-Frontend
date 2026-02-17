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

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');
require('dotenv').config();

const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SEED_FILE = path.join(__dirname, 'seed.sql');

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

        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        console.log('✅ Foreign key checks disabled');

        await runSQLFile(connection, SCHEMA_FILE, 'Schema', true);

        if (shouldSeed) {
            await runSQLFile(connection, SEED_FILE, 'Seed Data', true);
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Foreign key checks re-enabled');

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
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

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

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
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
    console.log('[Info] Listing tables...');
    try {
        const [dbInfo] = await pool.query('SELECT DATABASE() as db, USER() as user');
        console.log(`[Info] Connected to: ${JSON.stringify(dbInfo[0])}`);

        const [rows] = await pool.query('SHOW TABLES');
        const tableNames = rows.map(r => Object.values(r)[0]);
        console.log('[Info] Found Tables:', tableNames.length > 0 ? tableNames.join(', ') : 'NONE');
    } catch (err) {
        console.error('[Error]:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

async function inspectTable(tableName) {
    if (!tableName) {
        console.error('[Error] Please specify a table name.');
        process.exit(1);
    }
    console.log(`[Info] Inspecting table: ${tableName}`);
    try {
        const [rows] = await pool.query(`DESCRIBE ${tableName}`);
        console.table(rows.map(r => ({ column: r.Field, type: r.Type, null: r.Null, key: r.Key, default: r.Default })));
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
            await pool.query('ALTER TABLE appointments ADD COLUMN reason TEXT AFTER status');
            console.log('✅ Added "reason" column to appointments');
        } catch (err) {
            if (err.code !== 'ER_DUP_COLUMN_NAME') console.warn(`   ⚠️ Appointments column: ${err.message}`);
        }

        // 2. Add missing columns to tokens
        const tokenCols = [
            'ADD COLUMN doctor_id INT AFTER patient_id',
            'ADD COLUMN department VARCHAR(255) AFTER doctor_id',
            'ADD COLUMN generated_by INT AFTER department',
            'ADD COLUMN called_at DATETIME AFTER status',
            'ADD COLUMN completed_at DATETIME AFTER called_at'
        ];

        for (const col of tokenCols) {
            try {
                await pool.query(`ALTER TABLE tokens ${col}`);
                console.log(`✅ Tokens: ${col}`);
            } catch (err) {
                if (err.code !== 'ER_DUP_COLUMN_NAME') console.warn(`   ⚠️ Tokens column: ${err.message}`);
            }
        }

        // 3. Add missing columns to invoices
        const invoiceCols = [
            'ADD COLUMN consultation_fee DECIMAL(10,2) AFTER created_by',
            'ADD COLUMN lab_charges DECIMAL(10,2) AFTER consultation_fee',
            'ADD COLUMN medicine_charges DECIMAL(10,2) AFTER lab_charges',
            'ADD COLUMN other_charges DECIMAL(10,2) AFTER medicine_charges',
            'ADD COLUMN subtotal DECIMAL(10,2) AFTER other_charges',
            'ADD COLUMN discount_amount DECIMAL(10,2) AFTER subtotal',
            'ADD COLUMN discount_percent DECIMAL(5,2) AFTER discount_amount',
            'ADD COLUMN tax_amount DECIMAL(10,2) AFTER discount_percent',
            'ADD COLUMN items JSON AFTER tax_amount',
            'ADD COLUMN payment_mode VARCHAR(50) AFTER items',
            'ADD COLUMN payment_status VARCHAR(50) DEFAULT "UNPAID" AFTER payment_mode'
        ];

        for (const col of invoiceCols) {
            try {
                await pool.query(`ALTER TABLE invoices ${col}`);
                console.log(`✅ Invoices: ${col}`);
            } catch (err) {
                if (err.code !== 'ER_DUP_COLUMN_NAME') console.warn(`   ⚠️ Invoices column: ${err.message}`);
            }
        }

        // 4. Add lab_tests table if missing
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS lab_tests (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    patient_id INT NOT NULL,
                    doctor_id INT NOT NULL,
                    test_name VARCHAR(255) NOT NULL,
                    category VARCHAR(100),
                    department VARCHAR(100),
                    priority ENUM('Routine', 'Urgent', 'STAT') DEFAULT 'Routine',
                    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled', 'Delivered') DEFAULT 'Pending',
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patients(id),
                    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
                )
            `);
            console.log('✅ Ensured "lab_tests" table exists');
        } catch (err) {
            console.warn(`   ⚠️ Lab Tests table: ${err.message}`);
        }

        // 5. Add lab_test_id to lab_reports if missing
        try {
            await pool.query('ALTER TABLE lab_reports ADD COLUMN lab_test_id INT AFTER doctor_id');
            await pool.query('ALTER TABLE lab_reports ADD CONSTRAINT fk_lab_test FOREIGN KEY (lab_test_id) REFERENCES lab_tests(id) ON DELETE SET NULL');
            console.log('✅ Added "lab_test_id" to lab_reports');
        } catch (err) {
            if (err.code !== 'ER_DUP_COLUMN_NAME' && err.code !== 'ER_DUP_FIELDNAME')
                console.warn(`   ⚠️ Lab Reports column: ${err.message}`);
        }

        // 6. Add notifications table if missing
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS notifications (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    type VARCHAR(50) DEFAULT 'info',
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    link VARCHAR(255),
                    is_read TINYINT(1) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX (user_id),
                    INDEX (created_at),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Ensured "notifications" table exists');
        } catch (err) {
            console.warn(`   ⚠️ Notifications table: ${err.message}`);
        }

        // 7. Add publications to departments if missing
        try {
            await pool.query('ALTER TABLE departments ADD COLUMN publications JSON AFTER procedures');
            console.log('✅ Added "publications" column to departments');
        } catch (err) {
            if (err.code !== 'ER_DUP_COLUMN_NAME') console.warn(`   ⚠️ Departments column: ${err.message}`);
        }

        // 8. List users for verification
        const [users] = await pool.query('SELECT name, email, role, status FROM users');
        console.log(`\n[Info] Found ${users.length} users in database:`);
        users.slice(0, 5).forEach(u => console.log(`   - ${u.name} (${u.email}) [${u.role}]`));
        if (users.length > 5) console.log(`   ... and ${users.length - 5} more`);

    } catch (err) {
        console.error('[Patch] FAIL:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
}

// ============================================================================
// TEST DATABASE
// ============================================================================

async function testDatabase() {
    console.log('[Test] Environment Check:');
    console.log(` - DB_HOST: ${process.env.DB_HOST}`);
    console.log(` - DB_USER: ${process.env.DB_USER}`);
    console.log(` - DB_NAME: ${process.env.DB_NAME}`);
    console.log(` - DB_PORT: ${process.env.DB_PORT}`);

    console.log('\n[Test] Testing DB connection...');
    try {
        const [dbInfo] = await pool.query('SELECT DATABASE() as db, USER() as user, VERSION() as ver');
        console.log(`[Test] Connection Info: ${JSON.stringify(dbInfo[0])}`);

        const [tables] = await pool.query('SHOW TABLES');
        console.log(`[Test] Found ${tables.length} tables`);

        // Test departments query
        console.log('\n[Test] Testing departments query...');
        try {
            const [desc] = await pool.query('DESCRIBE departments');
            console.log(`[Test] Departments columns: ${desc.map(c => c.Field).join(', ')}`);

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
                GROUP BY d.id
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
        setupDatabase();
        break;
    case 'cloud-setup':
        cloudSetup();
        break;
    case 'reset':
        resetDatabase();
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
🏥 Clinixa Database Utilities

Usage:
  node db-utils.js setup [--seed]       - Setup local database
  node db-utils.js cloud-setup [--seed] - Setup cloud database
  node db-utils.js reset                - Reset database
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
                date: a.date.toISOString().split('T')[0],
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
            FROM DUAL
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
