// Bring in mongoose
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    // event's title, required
    title: {
        type: String,
        required: true
    },
    // event's location
    location: {
        type: String
    },
    // event's description
    description: {
        type: String
    },
    // event's color, decimal value of hex color number
    color: {
        type: Number,
        min: 0,
        max: 16777215, // decimal value of hex 0xFFFFFF
        required: true
    },
    // event's start time
    startAt: {
        // store as a number of minutes,
        // value range [0, 1440], 1440 = 24 hour * 60 minute
        // startTime must be less than endTime
        type: Number,
        min: 0,
        max: 1440,
        required: true
    },
    // event's end time
    endAt: {
        // store as a number of minutes,
        // value range [0, 1440], 1440 = 24 hour * 60 minute
        // endTime must be larger than startTime
        type: Number,
        min: 0,
        max: 1440,
        required: true
    },
    // event's day of week
    weekday: {
        // range [0,4], Monday to Friday
        type: Number,
        min: 0,
        max: 4,
        required: true
    },
    // date of this event being created
    createDate: {
        type: Date,
        default: Date.now
    }
});

// Decorate the returned object when document.toObject() and toJSON() is called,
// replace field name "_id" with "eventId", and delete field "__v"
EventSchema.set("toObject", {
    transform: (document, returnObjcet) => {
        returnObjcet.eventId = returnObjcet._id;
        delete returnObjcet._id;
        delete returnObjcet.__v;
    }
});

EventSchema.set("toJSON", {
    transform: (document, returnObjcet) => {
        returnObjcet.eventId = returnObjcet._id;
        delete returnObjcet._id;
        delete returnObjcet.__v;
    }
});

// Exports "Event" model
module.exports = mongoose.model("Event", EventSchema);
