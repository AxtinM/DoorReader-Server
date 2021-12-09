var express = require("express");
const mongoose = require("mongoose");
var app = express();
const cors = require("cors");
require("dotenv/config");

const bodyParser = require("body-parser");
const postsRoute = require("./routes/posts.routes");

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", postsRoute);

//connect toDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("connected to DB!")
);

const server = app.listen(3000, function () {
  console.log("app running on port.", server.address().port);
});
