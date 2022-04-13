const Joi = require('joi');
const { Schema, model } = require('mongoose');
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();

today = dd + '.' + mm + '.' + yyyy;
const transactionSchema = Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Choose the category'],
    },
    date: {
      type: Date,
      default: today,
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
