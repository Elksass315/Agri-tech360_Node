const express = require('express');
const router = express.Router();
const Plant = require('../model/plants');
const _ = require('lodash');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectid');

router.get('/', async (req, res) => {
    const plants = await Plant.find();
    res.send(plants);
});

router.get('/:id',validateObjectId , async (req, res) => {
    const plants = await Plant.findById(req.params.id);
    if (!plants) return res.status(404).send('The plant with the given ID was not found.');
    res.send(plants);
}); 

router.post('/', [auth, isAdmin], async (req, res) => {
    const plants = new Plant(_.pick(req.body, ['plantName', 'plantShortDescription', 'plantMediumDescription', 'plantDescription', 'plantImage1', 'plantImage2', 'mindegree', 'Temperature', 'Humidity', 'plantCareInstructions']));
    try {
        await plants.save();
        res.send(plants);
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.put('/:id', [auth, isAdmin, validateObjectId], async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).send('The plant with the given ID was not found.');

    plant.set(_.pick(req.body, ['plantName', 'plantShortDescription', 'plantMediumDescription', 'plantDescription', 'plantImage1', 'plantImage2', 'mindegree', 'Temperature', 'Humidity', 'plantCareInstructions']));
    try {
        await plant.save();
        res.send(plant);
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.delete('/:id', [auth, isAdmin, validateObjectId], async (req, res) => {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).send('The plant with the given ID was not found.');
    res.send(plant);

    res.send(plant);
});

module.exports = router;