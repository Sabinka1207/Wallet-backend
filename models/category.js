const { Schema, model } = require('mongoose');

const categorySchema = Schema(
  {
    type: {
      type: String,
      required: [true],
    },
    nameDropdown: {
      type: String,
      required: [true],
    },
    nameStatistics: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

const Category = model('category', categorySchema);

module.exports = { Category, schemas: {} };
