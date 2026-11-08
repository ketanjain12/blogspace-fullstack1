
const { pool } = require('../config/database');

const Post = {
    // Get all published posts with search and category filters
    async listPublished({ search = '', category = '' }) {
        let where = "WHERE p.status = 'published'";
        const args = [];

        if (search) {
            where += ' AND (p.title LIKE ? OR p.excerpt LIKE ?)';
            args.push(`%${search}%`, `%${search}%`);
        }

        if (category && category !== 'All') {
            where += ' AND p.category = ?';
            args.push(category);
        }

        const [rows] = await pool.execute(
            `SELECT
                p.id,
                p.title,
                p.slug,
                p.excerpt,
                p.cover_image,
                p.category,
                p.read_time,
                p.published_at,
                u.name author_name
            FROM posts p
            LEFT JOIN users u ON u.id = p.author_id
            ${where}
            ORDER BY p.published_at DESC`,
            args
        );

        return rows;
    },

    // Find a published post by slug
    async findPublishedBySlug(slug) {
        const [rows] = await pool.execute(
            "SELECT p.*, u.name author_name FROM posts p LEFT JOIN users u ON u.id = p.author_id WHERE p.slug = ? AND p.status = 'published'",
            [slug]
        );

        return rows[0] || null;
    },

    // Get all posts
    async listAll() {
        const [rows] = await pool.query(
            'SELECT * FROM posts ORDER BY created_at DESC'
        );

        return rows;
    },

    // Create a new post
    async create({
        authorId,
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        status,
        readTime
    }) {
        const [r] = await pool.execute(
            'INSERT INTO posts(author_id, title, slug, excerpt, content, category, cover_image, status, read_time, published_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                authorId,
                title,
                slug,
                excerpt,
                content,
                category,
                coverImage,
                status,
                readTime,
                status === 'published' ? new Date() : null
            ]
        );

        return r.insertId;
    },

    // Update an existing post
    async update(id, {
        title,
        excerpt,
        content,
        category,
        coverImage,
        status
    }) {
        const [r] = await pool.execute(
            "UPDATE posts SET title = ?, excerpt = ?, content = ?, category = ?, cover_image = ?, status = ?, published_at = IF(? = 'published', COALESCE(published_at, NOW()), NULL) WHERE id = ?",
            [
                title,
                excerpt,
                content,
                category,
                coverImage,
                status,
                status,
                id
            ]
        );

        return r.affectedRows;
    },

    // Delete a post
    async remove(id) {
        const [r] = await pool.execute(
            'DELETE FROM posts WHERE id = ?',
            [id]
        );

        return r.affectedRows;
    },

    // Get dashboard statistics
    async getStats() {
        const [[users]] = await pool.query(
            "SELECT COUNT(*) total FROM users WHERE role = 'user'"
        );

        const [[posts]] = await pool.query(
            'SELECT COUNT(*) total FROM posts'
        );

        const [[published]] = await pool.query(
            "SELECT COUNT(*) total FROM posts WHERE status = 'published'"
        );

        const [[drafts]] = await pool.query(
            "SELECT COUNT(*) total FROM posts WHERE status = 'draft'"
        );

        return {
            users: users.total,
            posts: posts.total,
            published: published.total,
            drafts: drafts.total
        };
    }
};

module.exports = Post;
