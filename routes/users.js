const express = require('express');
const router = express.Router();
const User = require('../model/users');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const admin = require('../middleware/admin');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/register', async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('User already registered.');
    }
    user = new User(_.pick(req.body, ['fullName', 'email', 'password', 'phoneNumber']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {
        await user.save();
        const token = user.generateAuthToken();

        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'fullName', 'email', 'phoneNumber']));
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }

});


router.put('update-password', auth, async (req, res) => {
    const user = await User.findById(req.user._id);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    try {
        await user.save();
        res.send('Password changed successfully.');
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
});


router.put('/:id', auth,async (req, res) => {
    const user = await User.findById(req.params.id);

    if (req.params.fullname) user.fullName = req.body.fullName;
    if (req.params.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    try {
        await user.save();
        res.send(user);
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }

});

router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    res.send(user);
});

router.put('/addAdmin/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    user.isAdmin = true;
    try {
        await user.save();
        res.send(user);
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
});

router.put('/removeAdmin/:id', [auth, admin], async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    user.isAdmin = false;
    try {
        await user.save();
        res.send(user);
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }   
});

module.exports = router;