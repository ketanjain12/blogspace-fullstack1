const PostService = require('../services/post.service');

exports.list = async (req, res, next) => {
  try {
    const posts = await PostService.list(req.query);
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    return next(error);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const post = await PostService.getBySlug(req.params.slug);
    return res.status(200).json({ success: true, post });
  } catch (error) {
    return next(error);
  }
};
