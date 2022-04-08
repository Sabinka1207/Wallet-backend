const { Transaction, schemas } = require('../../models/transaction');

const CreateError = require('http-errors');

const addNewTransaction = async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      console.log(error.message);
      throw new CreateError(400, error.message);
    }

    const data = { ...req.body, owner: req.user.id };
    const result = await Transaction.create(data);
    res.status(201).json(result);
  } catch (error) {
    if (error.message.toLowerCase().includes('validation failed')) {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = addNewTransaction;
