const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');

class Product extends Model { }

Product.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        maxlength: 10,
        minlength: 2,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        max: 10000,
        min: 0,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 10000,
        minlength: 2,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 100,
        minlength: 2,
    },
    seller: {
        type: DataTypes.UUID,
        references: {
            model: 'User',
            key: 'uuid'
        }
    }
}, {
    sequelize,
    modelName: 'Product',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'Product',
    // options
});

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true,
//         maxlength: 10,
//         minlength: 2,
//     },
//     price: {
//         type: Number,
//         required: true,
//         max: 10000,
//         min: 0,
//     },
//     description: {
//         type: String,
//         required: true,
//         maxlength: 10000,
//         minlength: 2,
//     },
//     image: {
//         type: String,
//     },
//     category: {
//         type: [String],
//         required: true,
//         maxlength: 100,
//         minlength: 2,
//     },
//     seller: {
//         userid: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//         }
//     }
// });

Product.sync({alter: true})
module.exports = Product;