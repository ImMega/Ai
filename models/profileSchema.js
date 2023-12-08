const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    mal: { type: String },
    al: { type: String }
});

const model = mongoose.model("ProfileSchema", profileSchema);

module.exports = model;