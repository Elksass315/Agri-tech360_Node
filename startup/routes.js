const express = require("express");
const users = require("../routes/users");
const auth = require("../routes/auth");
const weather = require("../routes/weather");
const product = require("../routes/products");
const favorite = require("../routes/favorites");
const plant = require("../routes/plants");
const blog = require("../routes/blogs");
// TODO: Waiting for https://github.com/tensorflowyg/tfjs/issues/8261 to Fix the tf issue
//const AI = require("./routes/AI")
const errorMiddleware = require("../middleware/error");


module.exports = function (app) {
    app.use(express.json());
    app.use(express.static('./uploads'));

    app.use("/api/users", users)
    app.use("/api/auth", auth)
    app.use("/api/weather", weather)
    app.use("/api/product", product)
    app.use("/api/favorite", favorite)
    app.use("/api/plant", plant)
    app.use("/api/blog", blog)
    //app.use("/api/ai", AI);

    app.use(errorMiddleware)
}