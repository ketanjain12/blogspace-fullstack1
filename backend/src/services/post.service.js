
const slugify = require('slugify');

const Post = require('../models/post.model');

// Validate post data
function validate(payload) {
    const { title, excerpt, content } = payload;

    if (
        !String(title || '').trim() ||
        !String(excerpt || '').trim() ||
        !String(content || '').trim()
    ) {
        const e = new Error(
            'Title, excerpt and content are required.'
        );

        e.status = 400;
        throw e;
    }
}

// Normalize post data
function normalize(payload) {
    const title = String(payload.title).trim();
    const content = String(payload.content).trim();
    const status = payload.status === 'published'
        ? 'published'
        : 'draft';

    return {
        title,
        excerpt: String(payload.excerpt).trim(),
        content,
        category: String(payload.category || 'General'),
        coverImage: String(
            payload.cover_image || payload.coverImage || ''
        ),
        status,
        readTime: Math.max(
            1,
            Math.ceil(content.split(/\s+/).length / 200)
        )
    };
}

module.exports = {
    // Get published posts
    list: ({ q = '', category = '' }) => {
        return Post.listPublished({
            search: q,
            category
        });
    },

    // Get published post by slug
    getBySlug: async (slug) => {
        const p = await Post.findPublishedBySlug(slug);

        if (!p) {
            const e = new Error('Article not found.');
            e.status = 404;
            throw e;
        }

        return p;
    },

    // Get all posts for admin
    listAdmin: () => Post.listAll(),

    // Create a new post
    create: async (payload, authorId) => {
        validate(payload);

        const data = normalize(payload);

        data.slug = slugify(data.title, {
            lower: true,
            strict: true
        }) + '-' + Date.now().toString().slice(-6);

        return Post.create({
            authorId,
            ...data
        });
    },

    // Update an existing post
    update: async (id, payload) => {
        validate(payload);

        const data = normalize(payload);

        const changed = await Post.update(id, data);

        if (!changed) {
            const e = new Error('Post not found.');
            e.status = 404;
            throw e;
        }

        return changed;
    },

    // Delete a post
    remove: async (id) => {
        const changed = await Post.remove(id);

        if (!changed) {
            const e = new Error('Post not found.');
            e.status = 404;
            throw e;
        }

        return changed;
    },

    // Get dashboard statistics
    stats: () => Post.getStats()
};
