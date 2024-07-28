const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');


class Favorite extends Model { }

Favorite.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    User: {
        type: DataTypes.UUID,
        references: {
            model: 'User',
            key: 'uuid'
        },
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