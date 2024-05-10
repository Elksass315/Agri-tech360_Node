const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const users = require("./routes/users");
const auth = require("./routes/auth");
const weather = require("./routes/weather");
const product = require("./routes/products");
const favorite = require("./routes/favorites");
const plant = require("./routes/plants");
const AI = require("./routes/AI")

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}

const app = express();

mongoose.connect(`mongodb://localhost:27017/agri-tech360`)
    .then(() => console.log("connecting to data base"))
    .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('./uploads'));

app.use("/api/users", users)
app.use("/api/auth", auth)
app.use("/api/weather", weather)
app.use("/api/product", product)
app.use("/api/favorite", favorite)
app.use("/api/plant", plant)
app.use("/api/ai", AI);

app.get("/", (req, res) => {
    res.send(`Welcome to Agri-Tech360`)
})

const port = 5000 || config.get("port");
app.listen(port, () => {
    console.log(`Server start successfully at http://127.0.0.1:${port}`)
})