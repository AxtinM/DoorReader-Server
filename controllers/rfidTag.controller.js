const User = require("../models/user.model");
const Device = require("../models/device.model");
const RfidTag = require("../models/tag.model");

exports.addRfidCardController = async (req, res) => {
    try {
        const { tagId } = req.body;
        if (!tagId) throw new Error("must provide tagId");
        const Tag = await RfidTag.findOne({ tagId: tagId });
        if (Tag) throw new Error("tag already exists");
        const user = req.user;
        const newTag = new RfidTag({ tagId: tagId, user: user._id });
        newTag.save();
        user.rfidTags.push(newTag);
        user.save();
        res.status(200).send({
            status: true,
            message: "tag added successfully",
            newTag: newTag,
        });
    } catch (err) {
        res.send({ status: false, message: err.message });
    }
};

exports.checkUserRfidTagController = async (req, res) => {
  try {
    const { tagId } = req.body;
    if (!tagId) throw new Error("must provide tagId");
    const rfidTag = await RfidTag.findOne({ tagId: tagId });
    if (!rfidTag) throw new Error("rfidTag not found");
    const user = await User.findById(rfidTag.user);
    if (!user) throw new Error("user not found");
    res.status(200).send({
      status: true,
      message: "user found",
      user,
    });
  } catch (err) {
    res.send({ status: false, message: err.message });
  }
}

exports.accessDeviceWithRfidController = async (req, res) => {
    try {
        const { tagId, macAddress } = req.params;
        console.log(tagId, macAddress);
        if (!tagId) throw new Error("must provide tagId");
        if (!macAddress) throw new Error("must provide macAddress");
        const rfidTag = await RfidTag.findOne({ tagId: tagId });
        if (!rfidTag) throw new Error("rfidTag not found");
        const device = await Device.findOne({ macAddress: macAddress });
        console.log(device);
        if (!device) throw new Error("device not found");
        const user = await User.findById(rfidTag.user);
        
        for (const d of [...user.ownedDevices, ...user.accessibleDevices]) {
            if (d.equals(device._id)) {
                res.status(200).send({
                    status: true,
                    message: "device found",
                    // device,
                });
            }
        }
    } catch (err) {
        res.status(401).send({ status: false, message: err.message });
    }
}

exports.getAllRfidCards = async (req, res) => {
    try {
        const user = req.user;
        const populated = await User.findById(user._id).populate({ path : "rfidTags" });
        res.status(200).send({
            status: true,
            message: "rfidTags found",
            rfidTags: populated.rfidTags,
        });
    } catch (err) {
        res.send({ status: false, message: err.message });
    }
}