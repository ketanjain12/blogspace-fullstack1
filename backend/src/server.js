
require('./config/env').validateEnv();

const app = require('./app');
const { initializeDatabase } = require('./config/database');

// Server port
const PORT = Number(process.env.PORT || 5000);

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`BlogSpace API listening on ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Database initialization failed:', error);
        process.exit(1);
    });
