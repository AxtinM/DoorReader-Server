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
});

deviceSchema.pre("deleteOne", async function (next) {
  try {
    let deletedDeviceId =
      this._conditions && this._conditions._id ? this._conditions._id : null;
    console.log("deleted deviceId: " + deletedDeviceId);
    if (deletedDeviceId) {
      const querry = await User.find({
        $or: [
          { ownedDevices: deletedDeviceId },
          { accessibleDevices: deletedDeviceId },
        ],
      });
      for (const user of querry) {
        const filterOwnedDevices = user.ownedDevices.filter(
          (id) => !id.equals(deletedDeviceId)
        );
        console.log("filtered OwnedDevices : " + filterOwnedDevices);
        const filterAccessibleDevices = user.accessibleDevices.filter(
          (id) => !id.equals(deletedDeviceId)
        );
        console.log("filtered AccessibleDevices : " + filterAccessibleDevices);
        user.ownedDevices = filterOwnedDevices;
        user.accessibleDevices = filterAccessibleDevices;
        user.save();
      }
    }
    next();
  } catch (e) {
    console.log(e);
  }
});

module.exports = model("Device", deviceSchema);
