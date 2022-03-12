const router = require("express").Router();
const {
  allOwnedDevicesController,
  allDevicesController,
  addDeviceController,
  addUserAccessToDeviceController,
  removeDeviceController,
} = require("../controllers/device.controller");
const { isAuth } = require("../middlewares/auth");

router.get("/", isAuth, allDevicesController);
router.get("/owned", isAuth, allOwnedDevicesController);
router.post("/add", isAuth, addDeviceController);
router.post("/remove", isAuth, removeDeviceController);
router.post("/adduser", isAuth, addUserAccessToDeviceController);

module.exports = router;
