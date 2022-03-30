const authRoutes = require("./auth.routes");
const deviceRoutes = require("./device.routes");
const userRoutes = require("./user.routes");
const rfidRoutes = require("./rfid.routes")
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/device", deviceRoutes);
router.use("/user", userRoutes);
router.use("/rfid", rfidRoutes);
module.exports = router;
