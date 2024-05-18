const c = require('config');
const express = require('express');
const route = express.Router();
const config = require('config');

route.get('/',async (req, res) => {
    if(!req.body.city) {
        return res.status(400).send('City is required');
    }

    if(!config.get('weatherApiKey')) {
        return res.status(500);
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${config.get('weatherApiKey')}`;
    
    fetch(url).then(response => response.json()).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send(err)
    });
});

module.exports = route;