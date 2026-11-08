const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const adRoutes = require('./routes/ad.routes');
const adminRoutes = require('./routes/admin.routes');

const {
    notFound,
    errorHandler
} = require('./middleware/error.middleware');

const app = express();

// Allowed CORS origins
const allowedOrigins = (
    process.env.CLIENT_URL || 'http://localhost:5173'
)
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);

// Security middleware
app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: 'cross-origin'
        }
    })
);

// CORS configuration
app.use(
    cors({
        origin: (origin, callback) => {
            if (
                !origin ||
                process.env.NODE_ENV !== 'production' ||
                allowedOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            const error = new Error('CORS origin not allowed');
            error.status = 403;

            return callback(error);
        },
        credentials: true
    })
);

app.use(express.json({
    limit: '2mb'
}));

// Health check route
app.get('/api/health', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        service: 'blogspace-api'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
