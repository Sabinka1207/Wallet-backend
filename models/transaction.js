const Joi = require('joi');
const { Schema, model } = require('mongoose');

const transactionSchema = Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Choose the category'],
    },
    date: {
      type: Date,
      required: [true, 'Choose the date'],
    },
    comment: {
      type: String,
    },
    amount: {
      type: String,
      required: [true, 'Set the spent amount'],
    },
    currentBalance: {
      type: String,
    },
    income: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const joiAddTransaction = Joi.object({
  amount: Joi.string().required(),
  date: Joi.date().required(),
  comment: Joi.string(),
  income: Joi.boolean(),
  category: Joi.string().required(),
});

const Transaction = model('transaction', transactionSchema);

module.exports = { Transaction, schemas: { add: joiAddTransaction } };
