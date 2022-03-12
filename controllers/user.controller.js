const User = require("../models/user.model");
const Device = require("../models/device.model");
exports.allUserController = async (req, res) => {
  try {
    const user = req.user;
    const users = await User.findById(user._id).populate(
      "users",
      "_id identifier fname lname"
    );
    res.status(200).send({ status: true, data: users.users });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.addUserIdentifierController = async (req, res) => {
  try {
    //   devices must be sent as an array if any []
    const { identifier, devices } = req.body;
    if (!identifier) throw new Error("Must provide user identifier");
    const newUser = await User.findOne({ identifier: identifier });
    if (!newUser) throw new Error("User not found");
    const user = req.user;
    const isUser = user.users.find((u) => newUser._id.equals(u));
    if (isUser) throw new Error("User already exists");

    user.users.push(newUser);
    user.save();
    let arrayDevices = [];
    if (devices) {
      arrayDevices = devices.map(async (mac) => {
        let obj = Device.findOne({ macAddress: mac });
        obj = await obj;
        for (let i = 0; i < obj.users.length; i++) {
          if (
            user._id.equals(obj.users[i].id) &&
            obj.users[i].role === "owner"
          ) {
            await User.findOneAndUpdate(
              { identifier: identifier },
              {
                $set: {
                  devices: [...newUser.devices, obj.users[i].id],
                },
              }
            );
            const device = await Device.findOne({ macAddress: mac });
            device.users.push({ id: obj.users[i].id, role: "user" });
          }
        }
      });
    }

    arrayDevices = Promise.all(arrayDevices).then((item) => item);
    res.status(200).send({
      status: true,
      message: "User added successfully",
      data: await arrayDevices,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
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
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.removeUserController = async (req, res) => {
  try {
    const { identifier } = req.body;
    const userToDelete = await User.findOne({ identifier });
    if (!userToDelete) throw new Error("user not found");
    const user = req.user;
    const newUsers = user.users.filter((usr) => !usr.equals(userToDelete._id));
    if (newUsers.length === user.users.length) {
      res.sendStatus(204);
    }
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { users: newUsers } }
    );

    await user.save();
    res.status(202).send({
      status: true,
      message: "User deleted successfully",
      data: user.users,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};
