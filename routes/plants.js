const express = require('express');
const router = express.Router();
const Plant = require('../model/plants');
const _ = require('lodash');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const plants = await Plant.findAll({ offset: (page - 1) * limit, limit: limit })
        .map(plant => {
            return {
                plantName: plant.plantName,
                plantShortDescription: plant.plantShortDescription,
                plantMediumDescription: plant.plantMediumDescription,
                plantDescription: plant.plantDescription,
                plantImage1: plant.plantImage1,
                plantImage2: plant.plantImage2,
                mindegree: plant.mindegree,
                Temperature: plant.Temperature,
                Humidity: plant.Humidity,
                plantCareInstructions: plant.plantCareInstructions
            };
        });


    const totalItems = await Plant.count();
    const totalPages = Math.ceil(totalItems / limit);

    res.send({
        page,
        limit,
        totalPages,
        totalItems,
        data: plants
    });
});

router.get('/:id', async (req, res) => {
    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).send('The plant with the given ID was not found.');
    res.send(plant.toJSON());
});

router.post('/', [auth, isAdmin], async (req, res) => {
    const plants = new Plant.build(_.pick(req.body, ['plantName', 'plantShortDescription', 'plantMediumDescription', 'plantDescription', 'plantImage1', 'plantImage2', 'mindegree', 'Temperature', 'Humidity', 'plantCareInstructions']));
    try {
        await plants.save();
        res.send(plants);
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.put('/:id', [auth, isAdmin], async (req, res) => {
    const plant = await Plant.findByPk(req.params.id);
    if (!plant) return res.status(404).send('The plant with the given ID was not found.');

    plant.set(_.pick(req.body, ['plantName', 'plantShortDescription', 'plantMediumDescription', 'plantDescription', 'plantImage1', 'plantImage2', 'mindegree', 'Temperature', 'Humidity', 'plantCareInstructions']));
    try {
        await plant.save();
        res.send(plant);
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.delete('/:id', [auth, isAdmin], async (req, res) => {
    const plant = await Plant.destroy(req.params.id);
    if (plant === 0) return res.status(404).send('The plant with the given ID was not found.');
    res.send(plant);

    res.send(plant);
});

module.exports = router;