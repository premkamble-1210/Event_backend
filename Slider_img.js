const mongoose = require('mongoose');

const Img_URL = new mongoose.Schema({
    uri: {
        type:[String],
        required: true
    }
});
const Event_img = mongoose.model("Event_img", Img_URL);

module.exports = Event_img;