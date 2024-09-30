const mongoose = require('mongoose');

// Define the schema for event information
const user = new mongoose.Schema({
    PRN: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    Admin: {
        type: Boolean,
        required: true
    },
    superAdmin:{
        type:Boolean,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    eventsOrg: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Eventinfo'
        }],
        required: false
    },
    Contact: {
        type: String,
        required: false
    },
    eventpart: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Eventinfo'
        }],
        required: false
    }
    
});

// Create a model for the Event schema
const userinfo = mongoose.model("userinfo", user);

module.exports = userinfo;
