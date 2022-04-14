const { Transaction } = require("../../models/transaction");

const getUserInfo = async (req, res, next) => {
  try {
    const { _id, name, token, balance } = req.user;
    const query = { owner: _id };
    const transactions = await Transaction.find(
      query,
      "-createdAt -updatedAt"
    )
      .sort({ date: -1 })
      .limit(6);

    res.json({
      _id,
      name,
      token,
      balance,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserInfo;
