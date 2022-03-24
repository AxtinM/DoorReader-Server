const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const User = require("../models/user.model");

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

deviceSchema.pre("deleteOne", async function (next) {
  try {
    let deletedDeviceId =
      this._conditions && this._conditions._id ? this._conditions._id : null;
    console.log("deleted deviceId: " + deletedDeviceId);
    if (deletedDeviceId) {
      const querry = await User.find({ devices: deletedDeviceId });
      for (let i = 0; i < querry.length; i++) {
        let newDevices = querry[i].devices;
        const devices = newDevices.filter((obj) => {
          console.log(!obj.equals(deletedDeviceId));
          return !obj.equals(deletedDeviceId);
        });

        await User.findOneAndUpdate(
          { _id: querry[i]._id },
          { $set: { devices: devices } }
        );
        querry[i].save();
      }
    }
    next();
  } catch (e) {
    console.log(e);
  }
});

module.exports = model("Device", deviceSchema);
