const router = require("express").Router();
const {
  allOwnedDevicesController,
  allAccessibleDevicesController,
  allDevicesController,
  addDeviceController,
  addUserAccessToDeviceController,
  removeDeviceController,
} = require("../controllers/device.controller");
const { accessDeviceWithRfidController } = require("../controllers/rfidTag.controller");
const { isAuth } = require("../middlewares/auth");

router.get("/", isAuth, allDevicesController);
router.get("/owned", isAuth, allOwnedDevicesController);
router.get("/accessible", isAuth, allAccessibleDevicesController);
router.post("/add", isAuth, addDeviceController);
router.post("/remove", isAuth, removeDeviceController);
router.post("/adduser", isAuth, addUserAccessToDeviceController);
router.get("/tag/:macAddress/:tagId", accessDeviceWithRfidController);

module.exports = router;
