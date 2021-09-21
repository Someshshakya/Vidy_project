const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid User or Password");

  const validPasswrod = await bcrypt.compare(req.body.password, user.password);
  if (!validPasswrod)
    return res.status(400).send("Your password or email is Incorrect ...!");
  const token = user.generateToken();
  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string().min(5).max(225).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(user, schema);
}
module.exports = router;
