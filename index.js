const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/DB")();
require("./startup/config")();
require("./startup/superadmin")();


app.get("/", (req, res) => {
    res.send(`Welcome to Agri-Tech360`)
})

const port = 5000 || process.env.PORT;
server = app.listen(port, () => {
    console.log(`Server start successfully at http://127.0.0.1:${port}`)
})

module.exports = server;