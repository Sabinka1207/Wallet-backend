const { Transaction, schemas } = require('../../models/transaction');
const { User } = require('../../models/user');

const CreateError = require('http-errors');

function countBalance(old, amount, income) {
  let final;

  if (income) {
    final = Number(old) + Number(amount);
    return final;
  } else {
    final = Number(old) - Number(amount);
    return final;
  }
}

const addNewTransaction = async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      console.log(error.message);
      throw new CreateError(400, error.message);
    }

    const balanceUpd = countBalance(
      req.user.balance,
      req.body.amount,
      req.body.income,
    );

    if (balanceUpd < 0) {
      throw new CreateError(409, 'Недостаточно средств');
    }

    const data = {
      ...req.body,
      owner: req.user.id,
      currentBalance: balanceUpd,
    };
    const result = await Transaction.create(data);
    const updUser = await User.findByIdAndUpdate(req.user.id, {
      balance: balanceUpd,
    });
    if (!updUser) {
      throw new CreateError(404, 'Not found');
    }

    res.status(201).json(result);
  } catch (error) {
    if (error.message.toLowerCase().includes('validation failed')) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = addNewTransaction;
