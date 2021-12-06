var express = require("express");
const mongoose = require("mongoose");
var app = express();
const cors = require("cors");
require("dotenv/config");
var mqttHandler = require('./mqtt_handler');

//Import ROUTERS
var bodyParser = require("body-parser");
const postsRoute = require("./routes/posts.routes");

app.use(cors());

//app.use('/user', userRoute);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//middlewares
// app.use(auth);
app.use("/login", postsRoute);

var mqttClient = new mqttHandler();
mqttClient.connect();

//ROUTES
app.get("/", (req, res) => {
    res.send("Welcome to our backend");
});
app.post("/registerDevice/#", function(req, res) {
    mqttClient.sendMessage(req.body.message);
    res.status(200).send("Message sent to mqtt");
});


//connect toDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
    console.log("connected to DB!")
);

//start listening to the server
//app.listen(3000);
var server = app.listen(3000, function() {
    console.log("app running on port.", server.address().port);
});