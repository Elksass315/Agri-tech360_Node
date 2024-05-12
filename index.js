const winston = require("winston")
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();

require("./startup/routes")(app);

winston.handleExceptions(new winston.transports.File({filename: config.get("logFile")}))
winston.add(winston.transports.File, {filename: config.get("logFile")})

process.on("unhandledRejection", (ex) => {
    throw ex;
});

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey is not defined.");
    process.exit(1);
}


mongoose.connect(`mongodb://localhost:27017/agri-tech360`)
    .then(() => console.log("connecting to Database"))
    .catch(err => console.log(err));


app.get("/", (req, res) => {
    res.send(`Welcome to Agri-Tech360`)
})

const port = 5000 || config.get("port");
app.listen(port, () => {
    console.log(`Server start successfully at http://127.0.0.1:${port}`)
})