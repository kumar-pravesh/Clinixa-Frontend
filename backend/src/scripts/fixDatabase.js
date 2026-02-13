const mysql = require('mysql2/promise');
require('dotenv').config();

const fixDatabase = async () => {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'smart_hospital',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('🛠️ Fixing Departments table...');
        const [deptCols] = await connection.query(`DESCRIBE departments`);
        const existingDeptCols = deptCols.map(c => c.Field);

        const deptUpdates = [
            { name: 'image_url', type: 'VARCHAR(255) DEFAULT NULL' },
            { name: 'tech', type: 'VARCHAR(255) DEFAULT NULL' },
            { name: 'success_rate', type: 'VARCHAR(50) DEFAULT "98%"' },
            { name: 'procedures', type: 'INT DEFAULT 0' }
        ];

        for (const col of deptUpdates) {
            if (!existingDeptCols.includes(col.name)) {
                console.log(`➕ Adding ${col.name} to departments...`);
                await connection.query(`ALTER TABLE departments ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        console.log('🛠️ Fixing Doctors table...');
        const [docCols] = await connection.query(`DESCRIBE doctors`);
        const existingDocCols = docCols.map(c => c.Field);
        if (!existingDocCols.includes('image_url')) {
            console.log('➕ Adding image_url to doctors...');
            await connection.query(`ALTER TABLE doctors ADD COLUMN image_url VARCHAR(255) DEFAULT NULL`);
        }

        console.log('🛠️ Creating lab_tests table if not exists...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS lab_tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                doctor_id INT,
                test_name VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                priority VARCHAR(50) DEFAULT 'Normal',
                status VARCHAR(50) DEFAULT 'Pending',
                department VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
            )
        `);

        console.log('✅ Database fix completed successfully!');

    } catch (err) {
        console.error('❌ Error fixing database:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

fixDatabase();
