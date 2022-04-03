const User = require("../models/user.model");
const Device = require("../models/device.model");

exports.allUserController = async (req, res) => {
  try {
    const user = req.user;
    const users = await User.findById(user._id).populate({
      path: "users",
      select: "_id identifier fname lname accessibleDevices",
      populate: {
        path: "accessibleDevices",
      },
    });
    res.status(200).send({ status: true, data: users.users });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.addUserIdentifierController = async (req, res) => {
  try {
    // devices must be sent as an array if any []
    const { identifier, devices } = req.body;
    console.log(identifier, devices);

    // must start with U
    if (!identifier) throw new Error("Must provide user identifier");
    const newUser = await User.findOne({ identifier: identifier });
    if (!newUser) throw new Error("User not found");
    const user = req.user;
    const isUser = user.users.find((u) => newUser._id.equals(u));
    if (isUser) throw new Error("User already exists");
    user.users.push(newUser);
    user.save();
    if (devices) {
      const arrayOfDevicesIds = await Device.find({
        macAddress: { $in: devices },
      });
      for (const id of arrayOfDevicesIds) {
        newUser.accessibleDevices.push(id);
      }
    }

    newUser.save();

    res.status(200).send({
      status: true,
      message: "User added successfully",
      newUser: newUser,
    });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.addUserEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error("must provide user identifier");
    const newUser = await User.findOne({ email: email });
    if (!newUser) throw new Error("user not found");
    const user = req.user;
    const isUser = user.users.find((u) => newUser._id.equals(u));
    if (isUser) throw new Error("user already exists");

    user.users.push(newUser);
    user.save();
    res.status(200).send({
      status: true,
      message: "user added successfully",
    });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.removeUserController = async (req, res) => {
  try {
    const { identifier } = req.body;
    const userToDelete = await User.findOne({ identifier });
    if (!userToDelete) throw new Error("user not found");
    const user = req.user;

    const users = user.users.filter((userId) => userId === userToDelete._id);
    user.users = users;

    await user.save();

    res.status(202).send({
      status: true,
      message: "User deleted successfully",
      data: user.users,
      deteltedUser: userToDelete,
    });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};

exports.changeUserAccessController = async (req, res) => {
  try {
    // devices must be sent as an array if any []
    const { identifier, devices } = req.body;

    // must start with U
    if (!identifier) throw new Error("Must provide user identifier");
    const newUser = await User.findOne({ identifier: identifier });
    if (!newUser) throw new Error("User not found");
    const user = req.user;
    user.save();
    if (devices) {
      const arrayOfDevicesIds = await Device.find({
        macAddress: { $in: devices },
      });
      newUser.accessibleDevices = arrayOfDevicesIds;
    } else {
      newUser.accessibleDevices = [];
    }

    newUser.save();

    res.status(200).send({
      status: true,
      message: "User changed successfully",
      access: newUser.accessibleDevices,
    });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
};
