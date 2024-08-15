const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');

class Plant extends Model { }

Plant.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    plantName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        maxlength: 100,
        minlength: 2,
    },
    plantShortDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 100,
        minlength: 2,
    },
    plantMediumDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 1000,
        minlength: 2,
    },
    plantDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 10000,
        minlength: 2,
    },
    plantImage1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    plantImage2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mindegree: {
        type: DataTypes.INTEGER,
        allowNull: false,
        max: 100,
        min: -100,
    },
    Temperature: {
        type: DataTypes.INTEGER,
        allowNull: false,
        max: 100,
        min: -100,
    },
    Humidity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        max: 100,
        min: 0,
    },
    plantCareInstructions: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 10000,
        minlength: 2,
    },
}, {
    sequelize,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'Plants'
});
Plant.sync({ alter: true });

module.exports = Plant
