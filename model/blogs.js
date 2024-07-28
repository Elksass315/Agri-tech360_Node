const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');

class Blog extends Model { }

Blog.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 1000]
        }
    },
    writerUser: {
        type: DataTypes.UUID,
        references: {
            model: 'User',
            key: 'uuid'
        },
        allowNull: false
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    category: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
            len: [1, 5]
        }
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Blog',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'Blogs',
});

Blog.sync({ alter: true})
module.exports = Blog;