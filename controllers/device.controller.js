const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Device = require("../models/device.model");

exports.allDevicesController = async (req, res) => {
  const user = req.user;
  try {
    const data = await Device.find();
    const newArr = [];
    for (i in data) {
      for (j in data[i].users) {
        const u = data[i].users[j];
        const checkUser = await User.findById(u.id);
        if (checkUser.identifier == user.identifier) {
          newArr.push(data[i]);
        }
      }
    }
    res.status(200).send({ status: true, data: newArr });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.allOwnedDevicesController = async (req, res) => {
  const user = req.user;
  try {
    const data = await user.populate({ path: "devices" });
    const devices = data.devices;

    res.status(200).send({ status: true, data: devices });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.addDeviceController = async (req, res) => {
  const { deviceName, macAddress } = req.body;
  try {
    const decoded = jwt.decode(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.userId);

    const device = await Device({
      deviceName,
      macAddress,
      users: { id: user._id, role: "owner" },
    });

    device.save();
    console.log(device);

    user.devices.push(device._id);
    user.save();

    res.status(201).send({
      status: true,
      message: "device added successfully",
      data: device,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err });
  }
};

exports.removeDeviceController = async (req, res) => {
  try {
    const { macAddress } = req.body;
    if (!macAddress) throw new Error("must provide a MAC address");
    console.log(macAddress);
    const querry = await Device.findOneAndRemove({ macAddress: macAddress });
    res.status(200).send({
      status: true,
      message: "device removed successfully",
      data: querry,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.addUserAccessToDeviceController = async (req, res) => {
  try {
    const { identifier, macAddress } = req.body;
    const decoded = jwt.decode(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.userId);
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
