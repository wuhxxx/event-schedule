// Bring in mongoose
const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: {
        // User name
        type: String,
        required: true,
        trim: true,
        // User name must be 2-12 long,
        // no leading space or "."
        // no ending space or "."
        match: /^(?=.{2,12}$)(?![.\s])[a-zA-Z0-9._\s]+(?<![.\s])$/
    },
    email: {
        // User email
        type: String,
        unique: true, // should be unique
        required: true
    },
    password: {
        // User password
        type: String,
        required: true
    },
    date: {
        // Register date
        type: Date,
        default: Date.now
    },
    // User's events
    events: [
        {
            // Reference to Event
            type: Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
});

// Decorate the returned object when document.toObject() is called:
// replace field name "_id" with "userId", and delete field "__v"
UserSchema.set("toObject", {
    transform: (document, returnObjcet) => {
        returnObjcet.userId = returnObjcet._id;
        delete returnObjcet._id;
        delete returnObjcet.__v;
    }
});

// Exports "User" model
module.exports = mongoose.model("User", UserSchema);
