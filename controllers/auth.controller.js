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

    res
      .status(200)
      .send({ status: true, message: "Logged In Succesfully", jwt: token });
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
