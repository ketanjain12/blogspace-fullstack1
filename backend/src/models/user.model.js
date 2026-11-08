
// const { pool } = require('../config/database');

// const User = {
//     // Find user by email
//     async findByEmail(email) {
//         const [rows] = await pool.execute(
//             'SELECT * FROM users WHERE email = ? LIMIT 1',
//             [email]
//         );

//         return rows[0] || null;
//     },

//     // Find public user details by ID
//     async findPublicById(id) {
//         const [rows] = await pool.execute(
//             'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ? LIMIT 1',
//             [id]
//         );

//         return rows[0] || null;
//     },

//     // Create a new user
//     async create({ name, email, passwordHash }) {
//         const [r] = await pool.execute(
//             'INSERT INTO users(name, email, password_hash) VALUES(?, ?, ?)',
//             [name, email, passwordHash]
//         );

//         return r.insertId;
//     },

//     // Get all users
//     async list() {
//         const [rows] = await pool.query(
//             'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
//         );

//         return rows;
//     },

//     // Update user active status
//     async setActive(id, isActive) {
//         const [r] = await pool.execute(
//             'UPDATE users SET is_active = ? WHERE id = ? AND role = "user"',
//             [isActive ? 1 : 0, id]
//         );

//         return r.affectedRows;
//     },

//     // Delete a user
//     async remove(id) {
//         const [r] = await pool.execute(
//             'DELETE FROM users WHERE id = ? AND role = "user"',
//             [id]
//         );

//         return r.affectedRows;
//     }
// };

// module.exports = User;

const { pool } = require('../config/database');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  async findPublicById(id) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, role, is_active, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, passwordHash }) {
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );
    return result.insertId;
  },

  // Fetch only normal users
  async list() {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, is_active, created_at
       FROM users
       WHERE role = 'user'
       ORDER BY created_at DESC`
    );
    return rows;
  },

  // Update user name and email
  async updateProfile(id, { name, email }) {
    const [result] = await pool.execute(
      `UPDATE users
       SET name = ?, email = ?
       WHERE id = ? AND role = 'user'`,
      [name, email, id]
    );
    return result.affectedRows;
  },

  // Activate or deactivate user
  async setActive(id, isActive) {
    const [result] = await pool.execute(
      `UPDATE users
       SET is_active = ?
       WHERE id = ? AND role = 'user'`,
      [isActive ? 1 : 0, id]
    );
    return result.affectedRows;
  },

  // Delete normal user only
  async remove(id) {
    const [result] = await pool.execute(
      `DELETE FROM users
       WHERE id = ? AND role = 'user'`,
      [id]
    );
    return result.affectedRows;
  },
};

module.exports = User;
