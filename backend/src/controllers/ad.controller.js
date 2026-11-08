const Ad = require('../models/ad.model');

exports.list = async (req, res, next) => {
  try {
    const ads = await Ad.listActive();
    return res.status(200).json({ success: true, ads });
  } catch (error) {
    return next(error);
  }
};
