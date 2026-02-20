const app = require('./app');
const { pool } = require('./config/db');
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
const shutdown = async () => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(async () => {
        console.log('[Server] HTTP server closed.');
        try {
            await pool.end();
            console.log('[DB] Pool closed.');
            process.exit(0);
        } catch (err) {
            console.error('[DB] Error during pool closure:', err.message);
            process.exit(1);
        }
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
// Trigger restart
