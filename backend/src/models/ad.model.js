
const { pool } = require('../config/database');

module.exports = {
    async listActive() {
        const [rows] = await pool.query(
            'SELECT placement, title, description, label FROM ads WHERE is_active = 1'
        );

        return rows;
    }
};
