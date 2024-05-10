const mongoose = require("mongoose");


const favoritesSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }
});


const Favorite = mongoose.model("favorite", favoritesSchema);

module.exports = Favorite;