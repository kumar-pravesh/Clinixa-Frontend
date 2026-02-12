const mysql = require('mysql2/promise');
require('dotenv').config();

const createTables = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        // Connect without database selected first
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            multipleStatements: true
        });

        console.log('Connected to MySQL server.');

        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);
        console.log(`Using database: ${process.env.DB_NAME}`);

        const schema = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            status VARCHAR(20) DEFAULT 'Active',
            reset_token VARCHAR(255),
            reset_token_expires TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS departments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE,
            department_id INT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS patients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT UNIQUE,
<<<<<<< HEAD
            registered_by INT,
=======
            registered_by INT, -- Receptionist ID
            name VARCHAR(255),
            email VARCHAR(255),
>>>>>>> d0fc20ce4496b160a4a18f91df8a0329b6a97b09
            dob DATE,
            gender VARCHAR(20),
            phone VARCHAR(20),
            blood_group VARCHAR(20),
            emergency_contact VARCHAR(20),
            address TEXT,
            history TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (registered_by) REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT,
            doctor_id INT,
            date DATE NOT NULL,
            time VARCHAR(20) NOT NULL, 
            status VARCHAR(50) DEFAULT 'Scheduled',
            FOREIGN KEY (patient_id) REFERENCES patients(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        );

        CREATE TABLE IF NOT EXISTS prescriptions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            appointment_id INT UNIQUE,
            doctor_id INT,
            patient_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (appointment_id) REFERENCES appointments(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        );

        CREATE TABLE IF NOT EXISTS medicines (
            id INT AUTO_INCREMENT PRIMARY KEY,
            prescription_id INT,
            name VARCHAR(255) NOT NULL,
            dosage VARCHAR(100),
            frequency VARCHAR(100),
            duration VARCHAR(100),
            FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS lab_reports (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT,
            doctor_id INT,
            uploaded_by INT,
            test_name VARCHAR(255),
            file_url TEXT,
            report_date DATE,
            FOREIGN KEY (patient_id) REFERENCES patients(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (uploaded_by) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            appointment_id INT UNIQUE,
            patient_id INT,
            amount DECIMAL(10,2),
            issued_date DATE,
            FOREIGN KEY (appointment_id) REFERENCES appointments(id),
            FOREIGN KEY (patient_id) REFERENCES patients(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_id INT,
            amount DECIMAL(10,2),
            method VARCHAR(50),
            transaction_id VARCHAR(100),
            status VARCHAR(50),
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (invoice_id) REFERENCES invoices(id)
        );

        CREATE TABLE IF NOT EXISTS tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT,
            doctor_id INT,
            generated_by INT,
            token_number VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id),
            FOREIGN KEY (generated_by) REFERENCES users(id)
        );
        `;

        // Split by semicolon and remove empty statements
        const statements = schema.split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        for (const [index, sql] of statements.entries()) {
            try {
                // console.log(`Executing statement ${index + 1}...`);
                await connection.query(sql);
            } catch (stmtErr) {
                console.error(`❌ Error executing statement ${index + 1}:`);
                console.error(sql);
                throw stmtErr;
            }
        }

        console.log('✅ Tables created successfully via MySQL!');

    } catch (err) {
        console.error('❌ Error creating tables:', err.message);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
};

createTables();
