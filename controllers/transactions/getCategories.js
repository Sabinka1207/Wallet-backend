const { Category } = require('../../models/category');

const getCategories = async (req, res, next) => {
  try {
    const data = await Category.find({});
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = getCategories;
