require("express-async-errors");
const winston = require("winston");
// require("winston-mongodb");
module.exports = function () {
  // this will catch the error if it will occour
  // process.on("uncaughtException", (ex) => {
  //   throw ex;
  // });
  // recommended...
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExcetions" })
  );
  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    // process.exit(1);
    throw ex;
  });
  winston.add(winston.transports.File, { filename: "logfile.log" });
  // winston.add(winston.transports.MongoDB, { db: "mongodb://localhost/vidly" });
};
