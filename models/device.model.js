const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const deviceSchema = new Schema({
  deviceName: {
    type: String,
    required: true,
    maxLength: 20,
  },
  macAddress: {
    type: String,
    required: true,
    unique: true,
  },
  /*
   * @keys {id=userId, role={owner, user}}
   */
  users: [{ type: Object }],
});

module.exports = model("Device", deviceSchema);
