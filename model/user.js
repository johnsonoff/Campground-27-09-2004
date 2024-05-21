const mongoose = require("mongoose");
const passportLocalSchema = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalSchema);

module.exports = mongoose.model("Users", userSchema);
