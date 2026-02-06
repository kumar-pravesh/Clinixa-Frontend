const { pool } = require('../config/db');

const createTables = async () => {
  try {
    // 0. Doctors Table (Reference)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        fees DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 1. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('patient', 'admin', 'doctor', 'receptionist', 'lab_staff')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Patients Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        dob DATE NOT NULL,
        gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Appointments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id INT REFERENCES doctors(id), 
        date DATE NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED')),
        payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Payments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        provider VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(100),
        status VARCHAR(20) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'SUCCESS', 'FAILED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Doctors
    const doctorCount = await pool.query('SELECT count(*) FROM doctors');
    if (parseInt(doctorCount.rows[0].count) === 0) {
      await pool.query(`
            INSERT INTO doctors (name, specialization, fees) VALUES 
            ('Dr. Smith', 'Cardiology', 500.00),
            ('Dr. Jones', 'Dermatology', 300.00),
            ('Dr. Williams', 'Neurology', 600.00),
            ('Dr. Brown', 'General Medicine', 200.00);
        `);
      console.log('Seeded Doctors');
    }

    console.log('Tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
};

createTables();
