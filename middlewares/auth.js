const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.decode(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res
          .status(403)
          .send({ status: false, message: "Unauthorized access" });
      }
      req.user = user;
      next();
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return res.send({ success: false, message: "Unauthorized access" });
      }
      if (error.name === "TokenExpiredError") {
        res.send({ success: false, message: "Session expired try sign in!" });
      }
      res
        .status(500)
        .send({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.status(400).send({ status: false, message: "Invalid authorization" });
  }
};
