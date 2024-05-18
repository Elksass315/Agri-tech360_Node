const express = require("express");
const router = express.Router();
const Favorite = require("../model/favorites");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectid");

router.put("/", auth, async (req, res) => {
    const favorite = new Favorite({
        User: req.user._id,
        product: req.body.product
    });
    try {
        await favorite.save();
        res.send(favorite);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get("/", auth, async (req, res) => {
    const favorite = await Favorite.find({ User: req.user._id }).populate("product");
    res.send(favorite);
});

router.delete("/:id", [auth, validateObjectId] , async (req, res) => {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return res.status(404).send("The favorite with the given ID was not found.");
    res.send(favorite);
});

module.exports = router;