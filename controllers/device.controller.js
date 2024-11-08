const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Device = require("../models/device.model");

exports.allDevicesController = async (req, res) => {
  const user = req.user;
  try {
    const data = await user.populate("ownedDevices accessibleDevices");
    const devices = [...data.ownedDevices, ...data.accessibleDevices];

    res.status(200).send({ status: true, data: devices });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.allOwnedDevicesController = async (req, res) => {
  const user = req.user;
  try {
    const data = await user.populate("ownedDevices");

    res.status(200).send({ status: true, data: data.ownedDevices });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.allAccessibleDevicesController = async (req, res) => {
  const user = req.user;
  try {
    const data = await user.populate("accessibleDevices");

    res.status(200).send({ status: true, data: data.accessibleDevices });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.addDeviceController = async (req, res) => {
  const { deviceName, macAddress } = req.body;
  try {
    const user = req.user;
    const isDevice = await Device.findOne({ macAddress });
    if (isDevice) throw new Error("Device already exists");
    const newDevice = await Device({
      deviceName,
      macAddress,
    });

    await newDevice.save();
    user.ownedDevices.push(newDevice._id);
    await user.save();

    res.status(201).send({
      status: true,
      message: "device added successfully",
      data: newDevice,
    });
  } catch (err) {
    res.send({ status: false, message: err });
  }
};

exports.removeDeviceController = async (req, res) => {
  try {
    const { macAddress } = req.body;
    if (!macAddress) throw new Error("must provide a MAC address");
    // console.log(macAddress);
    const device = await Device.findOne({ macAddress: macAddress });
    await Device.deleteOne({ _id: device._id });
    res.status(200).send({
      status: true,
      message: "device removed successfully",
      data: device,
    });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.addUserAccessToDeviceController = async (req, res) => {
  try {
    const { identifier, macAddress } = req.body;
    const user = req.user;
    const device = await Device.findOne({ macAddress });
    const isUser = device.users.filter(
      (d) => d.id == user._id && d.role == "owner"
    );
    if (!isUser)
      throw new Error("This user is not authorized to access this device");

    const userToAdd = await User.findOne({ identifier: identifier });
    if (!userToAdd) new Error("Unknown user (" + identifier + ")");

    device.users.push({ id: userToAdd._id, role: "user" });
    device.save();
    res.status(200).send({
      status: true,
      message: `given device access to ${identifier}`,
      data: device,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err.message });
  }
};
