const mongoose = require("mongoose");

const fileNodeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["folder", "file"], required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "FileNode", default: null },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "FileNode" }],
    filePath: { type: String },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FileNode", fileNodeSchema);
