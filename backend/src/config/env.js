
require('dotenv').config();

const required = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET'
];

// Validate required environment variables
function validateEnv() {
    const missing = required.filter(
        (key) => !process.env[key]
    );

    if (missing.length) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
}

module.exports = {
    validateEnv
};
