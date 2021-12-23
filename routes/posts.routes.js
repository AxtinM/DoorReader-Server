const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");

//get devices
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

//register device
router.post("/register", async (req, res) => {
  const post = new Post({
    rfid: req.body.rfid,
    user_name: req.body.user_name,
    mac_wifi: req.body.mac_wifi,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

//specific post by id
router.get("/:rfid", async (req, res) => {
  Post.find({ rfid: req.params.rfid }, function (err, rfid) {
    if (err) res.send(err);
    if (rfid.length > 0) {
      res.json(rfid);
    } else {
      res.status(500);
      res.send("error");
    }
  });
});

module.exports = router;
