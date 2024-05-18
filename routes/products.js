const express = require('express');
const router = express.Router();
const Product = require('../model/products');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectid');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => { 
    
    const products = await Product.find().sort('name');
    res.send(products);
});

router.post('/', [auth, admin, upload.single('image')] , async (req, res) => {
    const product = new Product(_.pick(req.body, ['name', 'price', 'description', 'category']));
    if(req.file) product.image = req.file.path;
    product.seller.userid = req.user;
    try {
        const result = await product.save();
        res.send(result);
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.put('/:id', [auth,admin,validateObjectId], async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('The product with the given ID was not found.');
    
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;
    if (req.body.description) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    if (req.body.seller && req.body.seller.userid) product.seller.userid = req.body.seller.userid;

    try {
        const result = await product.save();
        res.send(result);
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.delete('/:id', [auth, admin,validateObjectId], async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send('The product with the given ID was not found.');
    res.send(product);
});

router.get('/:id',validateObjectId , async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.send(product);
    } catch (error) {
        return res.status(404).send('The product with the given ID was not found.');
    }
});

module.exports = router;