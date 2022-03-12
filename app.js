var express = require("express");
const mongoose = require("mongoose");
var app = express();
// const cors = require("cors");
require("dotenv/config");

// DB_CONNECTION
require("./models/db");

// Port to listen on
const port = process.env.PORT;

const bodyParser = require("body-parser");
const apiRoutes = require("./routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", apiRoutes);

const server = app.listen(port, function () {
  console.log("app running on port.", server.address().port);
});
