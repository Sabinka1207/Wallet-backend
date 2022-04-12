const {Transaction} = require("../../models/transaction");

const gettransactions = async (req, res, next) => {
    const {_id} = req.user;
    console.log()
    const transactions = await Transaction.find({owner:_id}).populate("category","type nameDropdown nameStatistics").sort({ 'createdAt' : -1 }).limit(6);
      res.json({
      status: 'success',
      code: 200,
      transactions
  })
}

  module.exports = gettransactions;

