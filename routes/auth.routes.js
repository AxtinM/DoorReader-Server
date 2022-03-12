const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const {
  registerUserController,
  loginUserController,
  logoutUserController,
} = require("../controllers/auth.controller");

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout", isAuth, logoutUserController);

module.exports = router;
