const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantName: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
        minlength: 2,
    },
    plantShortDescription: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 2,
    },
    plantMediumDescription: {
        type: String,
        required: true,
        maxlength: 1000,
        minlength: 2,
    },
    plantDescription: {
        type: String,
        required: true,
        maxlength: 10000,
        minlength: 2,
    },
    plantImage1: {
        type: String,
        required: true,
    },
    plantImage2: {
        type: String,
        required: true,
    },
    mindegree: {
        type: Number,
        required: true,
        max: 100,
        min:-100,
    },
    Temperature: {
        type: Number,
        required: true,
        max: 100,
        min:-100,
    },
    Humidity: {
        type: Number,
        required: true,
        max: 100,
        min:0,
    },
    plantCareInstructions: {
        type: String,
        required: true,
        maxlength: 10000,
        minlength: 2,
    },
});

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant
