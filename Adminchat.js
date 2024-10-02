const mongoose = require('mongoose');

// Define the Message schema
const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Define the AdminMessage schema, which holds an array of MessageSchema objects
const AdminMessageSchema = new mongoose.Schema({
    messages: {
        type: [MessageSchema],  // Array of messages
        required: true
    }
});

const AdminMessage = mongoose.model("AdminMessage", AdminMessageSchema);

module.exports = AdminMessage;
