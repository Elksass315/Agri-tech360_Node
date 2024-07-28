const { Model, DataTypes, Deferrable } = require('sequelize');
const { sequelize } = require('../startup/DB');
const config = require("config");
const jwt = require("jsonwebtoken");

class User extends Model {
    static generateAuthToken() {
        const token = jwt.sign(
            {
                _id: this._id,
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
        maxlength: 255,
        minlength: 6,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        match: /.+\@.+\..+/,
        maxlength: 255,
        minlength: 6,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        match: /^\+(?:[0-9] ?){6,14}[0-9]$/,
        maxlength: 20,
        minlength: 5,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        maxlength: 1025,
        minlength: 5,
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
    // options
});

User.sync({ alter: true });
module.exports = User;