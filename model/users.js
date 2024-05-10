const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,

    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        match: /.+\@.+\..+/,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
        unique: true,
        match: /^\+(?:[0-9] ?){6,14}[0-9]$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1025,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});


userSchema.methods.generateAuthToken = function () {
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


const User = mongoose.model("User", userSchema);

module.exports = User;