const mongoose = require('mongoose');

// Define the schema for event information
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    monthNames: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    backimg: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rules: {
        type: [String], // Array of strings for rules
        required: false // Make this field optional
    },
    participants: {
        type: [{ 
            PRN: String,
            name: String,
            dept: String,
            contact: String,
            transction_id: String,
        }],
        required: false // Make this field optional
    },
    winner: {
        type: String,
        required: false // Make this field optional
    },
    status: {
        type: String,
        required: true
    },
    payment_upi_id: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: false // Make this field optional
    },
    organizer: {
        type: String,
        required: true
    },
    messages: {
        type: [{ 
            message: String,
            auther: String,
            admin: Boolean
        }],
        required: false // Make this field optional
    },
    contact: {
        type: String,
        required: false // Make this field optional
    },
    pending_participants: {
        type: [{ 
            PRN: String,
            name: String,
            dept: String,
            contact: String,
            transction_id: String,
        }],
        required: false // Make this field optional
    },
});

// Create a model for the Event schema
const Eventinfo = mongoose.model("Eventinfo", eventSchema);

module.exports = Eventinfo;
