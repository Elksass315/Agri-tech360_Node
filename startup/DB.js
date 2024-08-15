const { Sequelize } = require('sequelize');
const config = require("config");
const winston = require("winston");
const logging = require('./logging');
const sequelize = new Sequelize(config.get("db"), config.get("dbUser"), config.get("dbPass"), {
    host: 'localhost',
    dialect: 'postgres',
    logging: msg => winston.debug(msg)
}
);

module.exports.sequelize = sequelize

module.exports.startDb = function startDb() {
    sequelize.authenticate()
        .then(() => winston.info('Connected to the database...'))
        .catch(err => winston.error('Could not connect to the database...', err));
}