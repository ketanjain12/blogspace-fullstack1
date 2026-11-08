
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

// Generate JWT token
const createToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

module.exports = {
    // Register a new user
    async register({ name, email, password }) {
        name = String(name || '').trim();
        email = String(email || '').trim().toLowerCase();
        password = String(password || '');

        // Validate user input
        if (
            name.length < 2 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            password.length < 8
        ) {
            const e = new Error(
                'Enter a valid name, email and password (8+ characters).'
            );

            e.status = 400;
            throw e;
        }

        // Check if email already exists
        if (await User.findByEmail(email)) {
            const e = new Error('Email already registered.');

            e.status = 409;
            throw e;
        }

        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, 12);

        const id = await User.create({
            name,
            email,
            passwordHash
        });

        const user = {
            id,
            name,
            email,
            role: 'user'
        };

        return {
            user,
            token: createToken(user)
        };
    },

    // Login existing user
    async login({ email, password }) {
        const user = await User.findByEmail(
            String(email || '').trim().toLowerCase()
        );

        // Validate user credentials
        if (
            !user ||
            !user.is_active ||
            !(await bcrypt.compare(
                String(password || ''),
                user.password_hash
            ))
        ) {
            const e = new Error('Email or password is incorrect.');

            e.status = 401;
            throw e;
        }

        return {
            token: createToken(user),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
};
