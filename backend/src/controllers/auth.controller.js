const AuthService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const result = await AuthService.register(req.body);
    return res.status(201).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};

exports.me = (req, res) =>
  res.status(200).json({ success: true, user: req.user });
