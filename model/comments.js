const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');


class Comment extends Model { }

Comment.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 1000]
        }
    },
    commenterUser: {
        type: DataTypes.UUID,
        references: {
            model: 'User',
            key: 'uuid'
        },
        allowNull: false
    },
    product: {
        type: DataTypes.UUID,
        references: {
            model: 'Product',
            key: 'uuid'
        }
    },
    prediction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Comment',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'Comments',
});

Comment.sync({ alter: true });

exports.Comment = Comment;