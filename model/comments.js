const mongoose = require("mongoose");


const commentsSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1000,
    },
    commenterUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    prediction: {
        type: Boolean,
        default: false, 
        required: true,
    },
});


const Comment = mongoose.model("Comments", commentsSchema);

exports.Comment = Comment;