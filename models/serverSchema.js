const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
    serverId: { type: String, unique: true, required: true },
    countChId: { type: String },
    count: { type: Number },
    members: { type : Array , "default" : [] }
})

const model = mongoose.model("ServerModels", serverSchema);

module.exports = model;