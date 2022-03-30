const { addRfidCardController, getAllRfidCards } = require("../controllers/rfidTag.controller");
const { isAuth } = require("../middlewares/auth");
const router = require("express").Router();

router.post("/add", isAuth, addRfidCardController);
router.get("/", isAuth, getAllRfidCards)

module.exports = router;