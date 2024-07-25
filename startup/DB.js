const { Sequelize } = require('sequelize');
const config = require("config");
const winston = require("winston");

module.exports = function () {
    const sequelize = new Sequelize(config.get("db"), config.get("dbUser"), config.get("dbPass"), {
        host: 'localhost',
        dialect: 'postgres'});
        sequelize.authenticate()
            .then(() => winston.info('Connected to the database...'))
            .catch(err => winston.error('Could not connect to the database...', err));
}