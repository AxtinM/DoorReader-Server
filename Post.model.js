const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    rfid: {
        type: String,
        required: true,
    },
    mac_wifi: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        require: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Post", PostSchema);