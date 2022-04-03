const {
  addRfidCardController,
  getAllRfidCards,
  removeRfidCard,
} = require("../controllers/rfidTag.controller");
const { isAuth } = require("../middlewares/auth");
const router = require("express").Router();

router.get("/", isAuth, getAllRfidCards);
router.post("/add", isAuth, addRfidCardController);
router.delete("/remove/:tagId", isAuth, removeRfidCard);

module.exports = router;
