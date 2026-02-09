const { pool } = require('../config/db');

const setupForgotPasswordColumns = async () => {
    const client = await pool.connect();
    try {
        console.log('Adding forgot password columns to users table...');

        // Add reset_token column if it doesn't exist
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
        `);
        console.log('✓ reset_token column added/verified');

        // Add reset_token_expiry column if it doesn't exist
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
        `);
        console.log('✓ reset_token_expiry column added/verified');

        console.log('✓ Database migration completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Add these environment variables to your .env file:');
        console.log('   EMAIL_SERVICE=gmail');
        console.log('   EMAIL_USER=your-email@gmail.com');
        console.log('   EMAIL_PASSWORD=your-app-specific-password');
        console.log('   FRONTEND_URL=http://localhost:5173');
        console.log('\n2. Restart your backend server');
        console.log('3. Test the forgot password flow on the login page');

        process.exit(0);
    } catch (error) {
        console.error('Error during migration:', error.message);
        process.exit(1);
    } finally {
        client.release();
    }
};

setupForgotPasswordColumns();
