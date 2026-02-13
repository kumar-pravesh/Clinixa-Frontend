const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedAll = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('Connected to MySQL...');

    const password = 'Password@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const users = [
      { name: 'System Admin', email: 'admin@clinixa.life', role: 'admin' },
      { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@clinixa.life', role: 'doctor' },
      { name: 'Anjali Sharma', email: 'anjali@clinixa.life', role: 'receptionist' },
      { name: 'Suresh Raina', email: 'suresh@clinixa.life', role: 'lab_tech' },
      { name: 'John Doe', email: 'john.doe@email.com', role: 'patient' },
      // Generic emails for easier testing
      { name: 'Generic Doctor', email: 'doctor@clinixa.life', role: 'doctor' },
      { name: 'Generic Receptionist', email: 'receptionist@clinixa.life', role: 'receptionist' },
      { name: 'Generic Lab Tech', email: 'lab@clinixa.life', role: 'lab_tech' }

    ];

    for (const user of users) {
      const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [user.email]);
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
          [user.name, user.email, passwordHash, user.role, 'Active']
        );
        console.log(`Created: ${user.email}`);
      } else {
        console.log(`Exists: ${user.email}`);
      }
    }

    console.log('Seeding completed!');

  } catch (err) {
    console.error('Error seeding:', err);
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
};

seedAll();
