const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');
const config = require("config");
const jwt = require("jsonwebtoken");

class User extends Model {
    generateAuthToken() {
        const token = jwt.sign(
            {
                _id: this.uuid,
                fullName: this.fullName,
                email: this.email,
                isAdmin: this.isAdmin
            },
            config.get("jwtPrivateKey")
        );
        return token;
    };
}

User.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255]  
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [6, 255],  
            isEmail: true   
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [5, 20], 
            is: /^\+(?:[0-9] ?){6,14}[0-9]$/ 
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 1024]
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'User',
});

User.sync({ alter: true });
module.exports = User;