const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 10,
        minlength: 2,
    },
    price: {
        type: Number,
        required: true,
        max: 10000,
        min: 0,
    },
    description: {
        type: String,
        required: true,
        maxlength: 10000,
        minlength: 2,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        required: true,
        maxlength: 100,
        minlength: 2,
    },
    seller: {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;