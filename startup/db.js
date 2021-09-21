require("dotenv").config();
const mongoose = require("mongoose");
const config = require("config");
const func = require("joi/lib/types/func");
module.exports = function () {
  const db = process.env.DATABASE;
  mongoose
    .connect(db)
    .then(() => {
      console.log(`Connected to database ...`);
    })
    .catch((err) => {
      console.error(`Error connecting to the database. \n${err}`);
    });
};
