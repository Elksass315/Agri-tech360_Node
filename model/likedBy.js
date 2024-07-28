const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');

class LikedBy extends Model { }

LikedBy.init({
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
    blog: {
        type: DataTypes.UUID,
        references: {
            model: 'Blog',
            key: 'uuid'
        },
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'LikedBy',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'LikedBy',
    // options
});

LikedBy.sync({ alter: true });

module.exports = LikedBy;