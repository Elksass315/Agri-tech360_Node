const express = require('express');
const router = express.Router();
const Blog = require('../model/blogs');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectid');

router.get('/', async (req, res) => {
    const { page = 1, limit = 10, category, order = 'desc' } = req.query;

    let query = {};
    if (category) {
        query.category = { $in: [category] };
    }
    const sortOrder = order === 'asc' ? 1 : -1;
    
    const blogs = await Blog.find(query)
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalBlogs = await Blog.countDocuments(query);

    res.json({
        blogs,
        totalPages: Math.ceil(totalBlogs / limit),
        currentPage: parseInt(page)
    });
});

router.get('/:id',validateObjectId ,async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).send('Blog not found.');
    }
    res.send(blog);
});

router.post('/', auth, async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        writer: req.user._id,
        images: req.body.images,
        category: req.body.category
    });

    try {
        await blog.save();
        res.send(blog);
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }
});

router.put('/:id', [validateObjectId, auth], async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).send('Blog not found.');
    }
    if (blog.writer.userid.toString() !== req.user._id && !req.user.isAdmin) {
        return res.status(403).send('Access denied.');
    }

    if (req.body.title) blog.title = req.body.title;
    if (req.body.content) blog.content = req.body.content;
    if (req.body.images) blog.images = req.body.images;
    if (req.body.category) blog.category = req.body.category;

    try {
        await blog.save();
        res.send(blog);
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }
});


router.delete('/:id', [validateObjectId, auth], async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).send('Blog not found.');
    }
    if (blog.writer.userid.toString() !== req.user._id && !req.user.isAdmin) {
        return res.status(403).send('Access denied.');
    }

    await blog.remove();
    res.send(blog);
});

router.put('/like/:id', [validateObjectId, auth], async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).send('Blog not found.');
    }

    await blog.like(req.user._id);
    res.send(blog);
});

router.put('/unlike/:id', [validateObjectId, auth], async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(404).send('Blog not found.');
    }

    await blog.unlike(req.user._id);
    res.send(blog);
});

module.exports = router;