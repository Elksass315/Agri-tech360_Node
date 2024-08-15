const express = require('express');
const router = express.Router();
const Product = require('../model/products');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');
const { Op } = require('sequelize');
const Product = require('../model/products');
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
    let { page = 1, limit = 10, sort = 'name', order = 'asc', ...filters } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    const where = {};
    for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
            where[key] = { [Op.iLike]: `%${filters[key]}%` };
        }
    }

    const orderOptions = [[sort, order.toUpperCase()]];

    try {
        const { rows: products, count: totalProducts } = await Product.findAndCountAll({
            where,
            order: orderOptions,
            limit,
            offset
        });

        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products,
            totalProducts,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', [auth, admin, upload.single('image')], async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            image: req.file ? req.file.path : null,
            'seller.userid': req.user
        });

        res.send(product.toJSON());
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');

        const updatedProduct = {
            name: req.body.name || product.name,
            price: req.body.price || product.price,
            description: req.body.description || product.description,
            category: req.body.category || product.category,
            'seller.userid': req.body.seller && req.body.seller.userid ? req.body.seller.userid : product.seller.userid
        };

        await Product.update(updatedProduct, {
            where: { id: req.params.id }
        });

        res.send(updatedProduct);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');

        await Product.destroy({
            where: { id: req.params.id }
        });

        res.send(product);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        res.send(product);
    } catch (error) {
        return res.status(404).send('The product with the given ID was not found.');
    }
});


module.exports = router;