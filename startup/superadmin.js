const mongoose  = require("mongoose");
const config = require("config")
const User = require("../model/users");
const bcrypt = require("bcrypt");


module.exports = async function () {
    try {
        let user = await User.findOne({ email: config.get("superAdminMail") });
        if (user) {
            return console.log('Super Admin already registered.');
        }

        user = new User({
            fullName: "Super Admin",
            email: config.get("superAdminMail"),
            password: config.get("superAdminPass"),
            isAdmin: true,
            phoneNumber: "+000000000000"
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        console.log("Super Admin created successfully");
    }
    catch (ex) {
        throw new Error(`FATAL ERROR: Super Admin is not created.${ex}`);
    }

}