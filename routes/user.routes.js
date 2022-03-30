const {
  addUserIdentifierController,
  addUserEmailController,
  allUserController,
  removeUserController,
  changeUserAccessController,
} = require("../controllers/user.controller");

const { isAuth } = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", isAuth, allUserController);
router.delete("/remove", isAuth, removeUserController);
router.post("/add-id", isAuth, addUserIdentifierController);
router.post("/add-email", isAuth, addUserEmailController);
router.put("/change", isAuth, changeUserAccessController);
module.exports = router;
