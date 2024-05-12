const winston = require("winston");
require("express-async-errors");
const config = require("config")

module.exports = function () {
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: config.get("logFile") }));
    winston.add(winston.transports.File, { filename: config.get("logFile") })

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });
}