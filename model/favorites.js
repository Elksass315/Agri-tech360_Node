const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');


class Favorite extends Model { }

Favorite.init({
    // Model attributes are defined here
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    User: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Favorites',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'Favorite',
    // options
});

Favorite.sync({ alter: true });

module.exports = Favorite;