const mongoose = require("mongoose");
const argon2 = require("argon2");

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    require: true,
    unique: true,
    match: RegExp(/^$|^U[0-9]{5}$/i),
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [{ type: Object }],
  ownedDevices: [{ type: mongoose.Types.ObjectId, ref: "Device" }],
  accessibleDevices: [{ type: mongoose.Types.ObjectId, ref: "Device" }],
  rfidCard: [{ type: String }],
  users: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hash = await argon2.hash(this.password);
      this.password = hash;
      next();
    } catch (err) {
      return next(err);
    }
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password not Provided");
  try {
    return await argon2.verify(this.password, password);
  } catch (err) {
    console.log("Comparing passwords error : ", err);
  }
};

module.exports = mongoose.model("User", userSchema);
