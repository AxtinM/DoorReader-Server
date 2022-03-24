const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.registerUserController = async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser) throw new Error("User already registered");
    let identifier = "U" + Math.floor(Math.random() * 100000).toString();
    let identifierUsed = await User.findOne({ identifier });
    const i = 0;
    while (identifierUsed && i < 5) {
      identifier = "U" + Math.floor(Math.random() * 100000).toString();
      identifierUsed = await User.findOne({ identifier });
      i++;
    }
    const user = new User({
      fname,
      lname,
      email,
      password,
      identifier: identifier,
    });

    await user.save();
    res
      .status(201)
      .send({ status: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error(`User not found with this email`);
    const pass = await user.comparePassword(password);
    if (!pass) throw new Error("Password or Email not valid");
    let oldTokens = user.tokens || [];
    if (oldTokens.length) {
      oldTokens = oldTokens.filter((token) => {
        const timeDiff = Date.now() - parseInt(token.signedAt) / 1000;
        if (timeDiff < 86400) return true;
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await User.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token: token, signedAt: Date.now().toString() }],
    });
/**
 * "__v": 29,
    "_id": "622f2b5d3d0260fa4d356f2f",
    "devices": Array [
      "622f3e8c874d151eb2b59233",
      "622f3eb0874d151eb2b59238",
    ],
    "email": "a@m.com",
    "fname": "med",
    "identifier": "U56787",
    "lname": "attig",
    "password": "$argon2i$v=19$m=4096,t=3,p=1$weZaJfnLO3wYObILBRNcWQ$gfq4GVNH827TNjA8EWaRyRtb/u0myCuinRD2wPNEdWU",
    "rfidCard": Array [],
    "tokens": Array [
      Object {
        "signedAt": "1648119901613",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjJmMmI1ZDNkMDI2MGZhNGQzNTZmMmYiLCJpYXQiOjE2NDgxMTk5MDEsImV4cCI6MTY0ODIwNjMwMX0.HVvTcLRdknQoh0b7UxhWF_CrwMm2JG8dX7ueA8Z7R2o",
      },
    ],
    "users": Array [],

 */

    const data = { email: user.email, identifier: user.identifier, fname: user.fname, lname: user.lname, devices: user.devices, rfidCard: user.rfidCard, users: user.users  }
  res
    .status(200)
    .send({ status: true, message: "Logged In Succesfully", jwt: token, data: data});
     } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err });
  }
};

exports.logoutUserController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = req.user;

    const newTokens = user.tokens.filter((t) => {
      if (token !== t.token) return true;
    });
    console.log(newTokens);
    await User.findByIdAndUpdate(user._id, { tokens: newTokens });
    res.status(200).send({ status: true, message: "Logged Out Successfully!" });
  } catch (err) {
    res.status(500).send({ status: false, message: err });
  }
};
