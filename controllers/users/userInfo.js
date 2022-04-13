//const CreateError = require("http-errors");

const { Transaction } = require("../../models/transaction");

const getUserInfo = async (req, res, next) => {
  try {
    const { _id, name, token, balance } = req.user;
    const query = { owner: _id };
    let transactions;
    /* let currentBalance = "0.0"; */
    const recentTransactions = await Transaction.find(
      query,
      "-createdAt -updatedAt"
    )
      .sort({ date: -1 })
      .limit(6);
    if (!recentTransactions) {
      transactions = {};
    } else {
      transactions = recentTransactions;
      /*  currentBalance = recentTransactions[0].currentBalance; */
    }
    res.json({
      _id,
      name,
      token,
      balance,
      /* currentBalance, */
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserInfo;
