const PostService = require('../services/post.service');
const User = require('../models/user.model');

const sendNotFound = (res, resource) =>
  res.status(404).json({
    success: false,
    message: `${resource} not found.`,
  });

// Dashboard statistics
exports.stats = async (req, res, next) => {
  try {
    const stats = await PostService.stats();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    return next(error);
  }
};

// List all posts
exports.listPosts = async (req, res, next) => {
  try {
    const posts = await PostService.listAdmin();

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return next(error);
  }
};

// Create post
exports.createPost = async (req, res, next) => {
  try {
    const postId = await PostService.create(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      data: { id: postId },
    });
  } catch (error) {
    return next(error);
  }
};

// Update post
exports.updatePost = async (req, res, next) => {
  try {
    const affectedRows = await PostService.update(
      req.params.id,
      req.body
    );

    if (!affectedRows) {
      return sendNotFound(res, 'Post');
    }

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

// Delete post
exports.deletePost = async (req, res, next) => {
  try {
    const affectedRows = await PostService.remove(req.params.id);

    if (!affectedRows) {
      return sendNotFound(res, 'Post');
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

// Get normal users only
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.list();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(error);
  }
};

// Update user profile and status
exports.updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { name, email, is_active: isActive } = req.body;

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid user ID is required.',
      });
    }

    const existingUser = await User.findPublicById(userId);

    if (!existingUser || existingUser.role !== 'user') {
      return sendNotFound(res, 'User');
    }

    const hasProfileUpdate =
      name !== undefined || email !== undefined;

    const hasStatusUpdate = isActive !== undefined;

    if (!hasProfileUpdate && !hasStatusUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Provide name, email, or is_active to update.',
      });
    }

    if (hasProfileUpdate) {
      const normalizedName = String(
        name ?? existingUser.name
      ).trim();

      const normalizedEmail = String(
        email ?? existingUser.email
      ).trim().toLowerCase();

      if (
        normalizedName.length < 2 ||
        normalizedName.length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: 'Name must be between 2 and 100 characters.',
        });
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address.',
        });
      }

      await User.updateProfile(userId, {
        name: normalizedName,
        email: normalizedEmail,
      });
    }

    if (hasStatusUpdate) {
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'is_active must be a boolean value.',
        });
      }

      await User.setActive(userId, isActive);
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: await User.findPublicById(userId),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'This email address is already in use.',
      });
    }

    return next(error);
  }
};

// Delete normal user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid user ID is required.',
      });
    }

    if (userId === Number(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const affectedRows = await User.remove(userId);

    if (!affectedRows) {
      return sendNotFound(res, 'User');
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    return next(error);
  }
};
