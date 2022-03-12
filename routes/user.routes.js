const {
  addUserIdentifierController,
  addUserEmailController,
  allUserController,
  removeUserController,
} = require("../controllers/user.controller");

const { isAuth } = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", isAuth, allUserController);
router.delete("/remove", isAuth, removeUserController);
router.post("/add-id", isAuth, addUserIdentifierController);
router.post("/add-email", isAuth, addUserEmailController);

module.exports = router;
