const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 225,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1025,
  },
  isAdmin: Boolean,
});
userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, "somesh");
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
