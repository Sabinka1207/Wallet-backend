const Joi = require('joi');
const { Schema, model } = require('mongoose');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/;
const nameRegexp = /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/;

const userSchema = Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      match: passwordRegexp,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRegexp,
    },
    name: {
      type: String,
      minlength: 1,
      maxlength: 12,
      match: nameRegexp,
    },
    balance: {
      type: String,
      default: "0.00",
    },
    token: {
      type: String,
      default: '',
    },
  },
  { versionKey: false, timestamps: true },
);

const registerJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).pattern(passwordRegexp).required(),
  name: Joi.string().min(1).max(12).pattern(nameRegexp),
  token: Joi.string(),
});

const User = model('user', userSchema);

module.exports = {
  User,
  schemas: {
    register: registerJoiSchema,
  },
};
