const { Client } = require('pg');
require('dotenv').config();

const passwords = ['admin', 'postgres', 'root', 'password', '123456', ''];
const user = process.env.DB_USER || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const database = process.env.DB_NAME || 'hospital_db';
const port = process.env.DB_PORT || 5432;

async function testConnection() {
    for (const password of passwords) {
        console.log(`Testing password: '${password}'...`);
        const client = new Client({ user, host, database, password, port });
        try {
            await client.connect();
            console.log(`SUCCESS! Password is: '${password}'`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed: ${err.message}`);
        }
    }
    console.log('All passwords failed.');
    process.exit(1);
}

testConnection();
