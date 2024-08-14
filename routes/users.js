const express = require('express');
const router = express.Router();
const User = require('../model/users');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const admin = require('../middleware/admin');

router.get('/me', auth, async (req, res) => {
    const user = await User.findByPk(req.user._id);
    if (user === null) return res.status(404).send('User not found.');
    res.send(_.omit(user.toJSON(), 'password'));
});

router.post('/register', async (req, res) => {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        return res.status(400).send('User already registered.');
    }
    const userInfo = _.pick(req.body, ['fullName', 'email', 'phoneNumber'])
    const salt = await bcrypt.genSalt(10);
    userInfo.password = await bcrypt.hash(req.body.password, salt);
    const newUser = User.build(userInfo);
    try {
        await newUser.save();
        const token = newUser.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(newUser, ['uuid', 'fullName', 'email', 'phoneNumber']));
    }
    catch (ex) {
        res.status(400).send(ex.message);
    }

});


router.put('/update_password', auth, async (req, res) => {
    const user = await User.findByPk(req.user._id);
    if (!user) return res.status(404).send('User not found.');

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


router.put('/:id', auth, async (req, res) => {
    const user = await User.findByPk(req.user._id);
    if (!user) return res.status(404).send('User not found.');

    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;

    try {
        await user.save();
        res.send(_.pick(user, ['uuid', 'fullName', 'email', 'phoneNumber']));
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }

});


router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.destroy({ where: { uuid: req.params.id } });
    
    if (user === 0) return res.status(404).send('User not found.');
    res.send('User deleted successfully.');
});


router.put('/addAdmin/:id', [auth, admin], async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    user.isAdmin = true;
    try {
        await user.save();
        res.send(_.pick(user, ['uuid', 'fullName', 'email', 'phoneNumber', 'isAdmin']));
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
});

router.put('/removeAdmin/:id', [auth, admin], async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).send('User not found.');

    user.isAdmin = false;
    try {
        await user.save();
        res.send(_.pick(user, ['uuid', 'fullName', 'email', 'phoneNumber', 'isAdmin']));
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
});

module.exports = router;