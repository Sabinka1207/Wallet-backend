const CreateError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const dotenv = require("dotenv");
dotenv.config();

const { User, schemas } = require("../../models/user");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { error } = schemas.register.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const { email, password, name } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new CreateError(409, "Email in use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      id: uuidv4(),
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    await User.create({
      email,
      password: hashPassword,
      name,
      token,
    });

    res.status(201).json({
      status: "success",
      code: 201,
      token,
      user: {
        email,
        name,
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = register;
