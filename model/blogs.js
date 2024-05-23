const mongoose = require('mongoose');
const express = require('express');
const { create } = require('lodash');
const router = express.Router();

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1000
    },
    writer: {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    images: {
        type: [String],
    },
    category: {
        type: [String],
        required: true,
        maxlength: 5,
        minlength: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number, default: 0
    }, likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

BlogSchema.methods.like = function (userId) {
    if (!this.likedBy.includes(userId)) {
        this.likedBy.push(userId);
        this.likes += 1;
        return this.save();
    }
    return Promise.resolve(this);
};

BlogSchema.methods.unlike = function (userId) {
    const index = this.likedBy.indexOf(userId);
    if (index !== -1) {
        this.likedBy.splice(index, 1);
        this.likes -= 1;
        return this.save();
    }
    return Promise.resolve(this);
};

BlogSchema.methods.isLiked = function (userId) {
    return this.likedBy.includes(userId);
};

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;