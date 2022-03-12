const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err.message));
