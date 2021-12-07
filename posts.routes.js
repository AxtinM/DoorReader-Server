const express = require("express");
const router = express.Router();
const Post = require("../models/Post.model");

//get posts
router.get("/", async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get("/registeration", (req, res) => {
    res.send("registeration");
});

//submit posts
router.post("/registerDevice", async(req, res) => {
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

//specific post
router.get("/:postId", async(req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }
});
module.exports = router;